# Gestion de fichiers avec Cloudflare R2

## Configuration

Variables d'environnement requises dans `.env` :

```env
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://pub-xxx.r2.dev  # Optionnel, pour fichiers publics
```

## Architecture

```
Client                    Server                     R2
  │                         │                         │
  │─── requestUploadUrl ───>│                         │
  │<── { uploadUrl, key } ──│                         │
  │                         │                         │
  │─────────── PUT file ──────────────────────────────>│
  │                         │                         │
  │─── confirmUpload ──────>│── fileExistsInR2? ─────>│
  │<── { fileId, url } ─────│<── yes ─────────────────│
  │                         │── INSERT into DB        │
```

**Pourquoi ce flow ?**
- Pas de fichiers qui transitent par le serveur
- Upload direct vers R2 via presigned URL
- Le serveur vérifie que le fichier existe avant de créer l'entrée DB

## Server Actions disponibles

| Action | Description |
|--------|-------------|
| `requestUploadUrl()` | Obtenir une URL signée pour upload |
| `confirmUpload()` | Confirmer l'upload et créer l'entrée DB |
| `deleteFile()` | Supprimer un fichier (R2 + DB) |
| `getFileUrl()` | Obtenir l'URL d'accès à un fichier |
| `getUserFiles()` | Lister tous les fichiers de l'utilisateur |

## Utilisation

### Upload d'un fichier

```tsx
"use client";

import { requestUploadUrl, confirmUpload } from "@/shared/actions/files";

async function uploadFile(file: File, visibility: "public" | "private" = "private") {
  // 1. Demander une URL d'upload
  const request = await requestUploadUrl({
    filename: file.name,
    contentType: file.type,
    size: file.size,
    visibility,
  });

  if (!request.success) {
    throw new Error(request.error);
  }

  // 2. Upload direct vers R2
  const { uploadUrl, key, filename, contentType, size } = request.data;

  await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": contentType },
  });

  // 3. Confirmer l'upload
  const confirm = await confirmUpload({
    key,
    filename,
    contentType,
    size,
    visibility,
  });

  if (!confirm.success) {
    throw new Error(confirm.error);
  }

  return { fileId: confirm.fileId, url: confirm.url };
}
```

### Composant d'upload complet

```tsx
"use client";

import { useState } from "react";
import { requestUploadUrl, confirmUpload } from "@/shared/actions/files";
import { Button } from "@/shared/components/ui/button";

export function FileUploader() {
  const [uploading, setUploading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Request upload URL
      const request = await requestUploadUrl({
        filename: file.name,
        contentType: file.type,
        size: file.size,
        visibility: "private",
      });
      if (!request.success) throw new Error(request.error);

      // 2. Upload to R2
      const { uploadUrl, ...metadata } = request.data;
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      // 3. Confirm upload
      const confirm = await confirmUpload(metadata);
      if (!confirm.success) throw new Error(confirm.error);

      console.log("Uploaded:", confirm.fileId);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        type="file"
        onChange={handleChange}
        disabled={uploading}
        accept="image/*,.pdf"
      />
      {uploading && <p>Uploading...</p>}
    </div>
  );
}
```

### Supprimer un fichier

```tsx
import { deleteFile } from "@/shared/actions/files";

async function handleDelete(fileId: string) {
  const result = await deleteFile(fileId);

  if (!result.success) {
    console.error(result.error);
    return;
  }

  // Fichier supprimé de R2 et de la DB
}
```

### Afficher un fichier

```tsx
import { getFileUrl } from "@/shared/actions/files";

async function displayFile(fileId: string) {
  const result = await getFileUrl(fileId);

  if (!result.success) {
    console.error(result.error);
    return null;
  }

  // result.url = URL d'accès (publique ou presigned)
  // result.expiresAt = Date d'expiration (pour fichiers privés)
  return result.url;
}
```

### Lister les fichiers d'un utilisateur

```tsx
import { getUserFiles } from "@/shared/actions/files";

async function listFiles() {
  const result = await getUserFiles();

  if (!result.success) {
    console.error(result.error);
    return [];
  }

  return result.files;
  // Chaque fichier: { id, key, filename, contentType, size, visibility, uploadedAt }
}
```

## Visibilité des fichiers

| Visibilité | Accès | URL |
|------------|-------|-----|
| `public` | Tout le monde | URL publique permanente (`R2_PUBLIC_URL/key`) |
| `private` | Propriétaire uniquement | URL presigned (expire en 1h) |

## Validation

Par défaut, les fichiers sont validés :

- **Types autorisés** : `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `application/pdf`
- **Taille max** : 10 MB

Pour personnaliser :

```tsx
const result = await requestUploadUrl({
  filename: file.name,
  contentType: file.type,
  size: file.size,
  validationOptions: {
    allowedTypes: ["image/png", "image/jpeg"],
    maxSize: 5 * 1024 * 1024, // 5 MB
  },
});
```

## Structure des clés R2

```
{visibility}/{userId}/{timestamp}-{randomId}-{filename}

Exemples :
- public/user_abc123/1699999999999-a1b2c3d4-photo.jpg
- private/user_abc123/1699999999999-e5f6g7h8-document.pdf
```

## Sécurité

- Les fichiers privés ne sont accessibles qu'à leur propriétaire
- Les URLs presigned expirent après 1 heure
- La validation côté serveur empêche les uploads non autorisés
- Le fichier doit exister dans R2 avant la création de l'entrée DB (pas de records orphelins)
