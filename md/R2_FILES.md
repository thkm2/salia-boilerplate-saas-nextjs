# Cloudflare R2 - Gestion de fichiers

Ce guide explique comment utiliser l'infrastructure de gestion de fichiers avec Cloudflare R2.

## Architecture

```
src/
├── lib/
│   ├── r2.ts                      # Client R2 + helpers
│   └── db/schema/
│       └── files.ts               # Table métadonnées fichiers
│
└── shared/
    └── actions/
        └── files.ts               # Server actions
```

## Configuration

### 1. Variables d'environnement

Ajoutez ces variables dans votre `.env` :

```env
# Cloudflare R2 Storage
R2_ACCOUNT_ID=your_account_id        # ID du compte Cloudflare
R2_ACCESS_KEY_ID=your_access_key     # Clé d'accès API R2
R2_SECRET_ACCESS_KEY=your_secret     # Secret de la clé API
R2_BUCKET_NAME=your_bucket_name      # Nom du bucket
R2_PUBLIC_URL=https://pub-xxx.r2.dev # URL publique (optionnel)
```

### 2. Configuration Cloudflare

#### Créer un bucket R2

1. Allez dans Cloudflare Dashboard → R2
2. Cliquez "Create bucket"
3. Nommez votre bucket (ex: `my-saas-files`)

#### Générer des clés API

1. R2 → Manage R2 API Tokens
2. Create API token
3. Permissions: Object Read & Write
4. Copiez `Access Key ID` et `Secret Access Key`

#### Activer l'accès public (optionnel)

Pour servir des fichiers publics via URL directe :

1. Sélectionnez votre bucket
2. Settings → Public access → Allow Access
3. Copiez l'URL publique dans `R2_PUBLIC_URL`

#### Configurer CORS

Pour permettre l'upload direct depuis le navigateur :

1. Bucket → Settings → CORS Policy
2. Ajoutez :

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://votre-domaine.com"],
    "AllowedMethods": ["GET", "PUT", "DELETE"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

## Concepts clés

### Visibilité des fichiers

| Type | Stockage | Accès |
|------|----------|-------|
| `private` | `private/{userId}/...` | URL présignée temporaire (1h) |
| `public` | `public/{userId}/...` | URL directe permanente |

### Flux d'upload

```
1. Client → requestUploadUrl()     # Demande URL d'upload
2. Serveur → Crée record en DB     # Métadonnées enregistrées
3. Serveur → Génère presigned URL  # URL temporaire pour upload
4. Client → PUT vers R2            # Upload direct vers R2
5. Client → confirmUpload()        # Confirme la réussite
6. Serveur → Retourne URL d'accès  # Fichier prêt à utiliser
```

## Server Actions

### `requestUploadUrl`

Demande une URL présignée pour uploader un fichier.

```typescript
import { requestUploadUrl } from "@/shared/actions/files";

const result = await requestUploadUrl({
  filename: "photo.jpg",
  contentType: "image/jpeg",
  size: 1024000, // bytes
  visibility: "private", // ou "public"
});

if (result.success) {
  const { uploadUrl, fileId, key } = result.data;
  // uploadUrl: URL pour l'upload PUT
  // fileId: ID en base de données
  // key: Clé de stockage R2
}
```

**Options de validation personnalisées :**

```typescript
const result = await requestUploadUrl({
  filename: "document.pdf",
  contentType: "application/pdf",
  size: 5000000,
  visibility: "private",
  validationOptions: {
    allowedTypes: ["application/pdf", "image/png"],
    maxSize: 20 * 1024 * 1024, // 20MB
  },
});
```

### `confirmUpload`

Confirme qu'un upload a réussi et récupère l'URL d'accès.

```typescript
import { confirmUpload } from "@/shared/actions/files";

const result = await confirmUpload(fileId);

if (result.success) {
  console.log(result.url); // URL d'accès au fichier
}
```

### `getFileUrl`

Récupère l'URL d'accès à un fichier existant.

```typescript
import { getFileUrl } from "@/shared/actions/files";

const result = await getFileUrl(fileId);

if (result.success) {
  console.log(result.url);
  if (result.expiresAt) {
    // URL présignée avec expiration
    console.log("Expire:", result.expiresAt);
  }
}
```

### `deleteFile`

Supprime un fichier (soft delete par défaut).

```typescript
import { deleteFile } from "@/shared/actions/files";

// Soft delete (garde le fichier dans R2)
await deleteFile(fileId);

// Hard delete (supprime aussi de R2)
await deleteFile(fileId, true);
```

### `getUserFiles`

Liste tous les fichiers de l'utilisateur connecté.

```typescript
import { getUserFiles } from "@/shared/actions/files";

const result = await getUserFiles();

if (result.success) {
  result.files.forEach((file) => {
    console.log(file.filename, file.size, file.visibility);
  });
}
```

## Exemples d'implémentation

### Composant d'upload simple

```tsx
"use client";

import { useState } from "react";
import { requestUploadUrl, confirmUpload } from "@/shared/actions/files";
import { Button } from "@/shared/components/ui/button";

export function FileUploader() {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // 1. Demander l'URL d'upload
      const request = await requestUploadUrl({
        filename: file.name,
        contentType: file.type,
        size: file.size,
        visibility: "private",
      });

      if (!request.success) {
        throw new Error(request.error);
      }

      // 2. Upload direct vers R2
      const uploadResponse = await fetch(request.data.uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      // 3. Confirmer l'upload
      const confirm = await confirmUpload(request.data.fileId);

      if (confirm.success && confirm.url) {
        setFileUrl(confirm.url);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        type="file"
        onChange={handleUpload}
        disabled={uploading}
        accept="image/*,application/pdf"
      />
      {uploading && <p>Upload en cours...</p>}
      {fileUrl && (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
          Voir le fichier
        </a>
      )}
    </div>
  );
}
```

### Upload d'avatar utilisateur

```tsx
"use client";

import { useState } from "react";
import { requestUploadUrl, confirmUpload } from "@/shared/actions/files";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/components/ui/avatar";

interface AvatarUploaderProps {
  currentAvatar?: string;
  onAvatarChange: (url: string) => void;
}

export function AvatarUploader({ currentAvatar, onAvatarChange }: AvatarUploaderProps) {
  const [uploading, setUploading] = useState(false);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation côté client
    if (!file.type.startsWith("image/")) {
      alert("Seules les images sont acceptées");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5MB");
      return;
    }

    setUploading(true);

    try {
      const request = await requestUploadUrl({
        filename: file.name,
        contentType: file.type,
        size: file.size,
        visibility: "public", // Avatar public
        validationOptions: {
          allowedTypes: ["image/jpeg", "image/png", "image/webp"],
          maxSize: 5 * 1024 * 1024,
        },
      });

      if (!request.success) {
        throw new Error(request.error);
      }

      await fetch(request.data.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      const confirm = await confirmUpload(request.data.fileId);

      if (confirm.success && confirm.url) {
        onAvatarChange(confirm.url);
      }
    } catch (error) {
      console.error("Avatar upload failed:", error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <label className="cursor-pointer">
      <Avatar className="h-20 w-20">
        <AvatarImage src={currentAvatar} />
        <AvatarFallback>{uploading ? "..." : "+"}</AvatarFallback>
      </Avatar>
      <input
        type="file"
        className="hidden"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        disabled={uploading}
      />
    </label>
  );
}
```

### Liste de fichiers avec suppression

```tsx
"use client";

import { useEffect, useState } from "react";
import { getUserFiles, deleteFile, getFileUrl } from "@/shared/actions/files";
import { Button } from "@/shared/components/ui/button";
import { Trash2, Download } from "lucide-react";

type FileRecord = {
  id: string;
  filename: string;
  size: number;
  contentType: string;
  visibility: string;
  uploadedAt: Date;
};

export function FileList() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadFiles() {
    const result = await getUserFiles();
    if (result.success) {
      setFiles(result.files);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadFiles();
  }, []);

  async function handleDownload(fileId: string) {
    const result = await getFileUrl(fileId);
    if (result.success) {
      window.open(result.url, "_blank");
    }
  }

  async function handleDelete(fileId: string) {
    if (!confirm("Supprimer ce fichier ?")) return;

    const result = await deleteFile(fileId);
    if (result.success) {
      setFiles(files.filter((f) => f.id !== fileId));
    }
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-3 border rounded-lg"
        >
          <div>
            <p className="font-medium">{file.filename}</p>
            <p className="text-sm text-muted-foreground">
              {formatSize(file.size)} • {file.visibility}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDownload(file.id)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDelete(file.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      {files.length === 0 && <p>Aucun fichier</p>}
    </div>
  );
}
```

## Helpers R2 (usage avancé)

Pour des cas d'usage avancés, vous pouvez utiliser directement les helpers du client R2 :

```typescript
import {
  generateFileKey,
  getUploadUrl,
  getDownloadUrl,
  getPublicUrl,
  deleteFromR2,
  fileExistsInR2,
  validateFile,
  DEFAULT_ALLOWED_TYPES,
  DEFAULT_MAX_SIZE,
} from "@/lib/r2";

// Générer une clé unique
const key = generateFileKey("user_123", "photo.jpg", "private");
// → "private/user_123/1699999999999-a1b2c3d4-photo.jpg"

// Valider un fichier
const validation = validateFile("image/jpeg", 5000000);
if (!validation.valid) {
  console.error(validation.error);
}

// Vérifier si un fichier existe
const exists = await fileExistsInR2(key);

// Supprimer directement de R2
await deleteFromR2(key);
```

## Types MIME autorisés par défaut

```typescript
const DEFAULT_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
];

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
```

## Schéma de la table `file`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | text | Clé primaire (UUID) |
| `userId` | text | FK vers user.id |
| `key` | text | Clé R2 unique |
| `filename` | text | Nom original du fichier |
| `contentType` | text | Type MIME |
| `size` | integer | Taille en bytes |
| `visibility` | text | "public" ou "private" |
| `uploadedAt` | timestamp | Date d'upload |
| `deletedAt` | timestamp | Soft delete (null = actif) |

## Sécurité

- **Ownership** : Chaque fichier est lié à un `userId`, vérifié à chaque accès
- **URLs présignées** : Expiration courte (1h par défaut) pour les fichiers privés
- **Validation** : Types MIME et taille vérifiés avant génération d'URL
- **Soft delete** : Les fichiers sont marqués supprimés, pas effacés immédiatement
- **Préfixes séparés** : `public/` et `private/` pour isolation dans le bucket

## Bonnes pratiques

1. **Toujours valider côté client ET serveur** - Ne faites pas confiance aux validations client
2. **Utilisez `visibility: "public"` avec parcimonie** - Seulement pour les fichiers vraiment publics
3. **Gérez les erreurs d'upload** - Le réseau peut échouer, prévoyez des retries
4. **Nettoyez les fichiers orphelins** - Créez un cron pour supprimer les fichiers non confirmés
5. **Limitez la taille selon le plan** - Utilisez `validationOptions` pour différencier les limites
