import { Nav } from "@/components/features/landing-page/nav";
import { Footer } from "@/components/features/landing-page/footer";

const LandingPage = () => {
	return (
		<>
			<Nav />
			<div className="min-h-dvh w-full flex flex-col justify-center items-center">
				<h1>Landing Page</h1>
			</div>
			<Footer />
		</>
	);
};

export default LandingPage;
