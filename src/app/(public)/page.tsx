import { Nav } from "@/shared/components/landing/nav";
import { Footer } from "@/shared/components/landing/footer";

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
