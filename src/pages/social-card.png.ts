import { Resvg } from "@resvg/resvg-js";
import satori, { type SatoriOptions } from "satori";
import { html } from "satori-html";
import RobotoMonoBold from "@/assets/roboto-mono-700.ttf";
import RobotoMono from "@/assets/roboto-mono-regular.ttf";

const ogOptions: SatoriOptions = {
	fonts: [
		{
			data: Buffer.from(RobotoMono),
			name: "Roboto Mono",
			style: "normal",
			weight: 400,
		},
		{
			data: Buffer.from(RobotoMonoBold),
			name: "Roboto Mono",
			style: "normal",
			weight: 700,
		},
	],
	height: 630,
	width: 1200,
};

const markup = () =>
	html`<div tw="flex flex-col w-full h-full bg-[#1b1e22] text-[#FBFAF9] items-center justify-center">
		<div tw="flex items-center">
			<svg height="100" width="150" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 100">
				<path
					d="M 10 10 V 70 L 30 90 H 70 L 90 70 V 10 H 65 V 65 H 35 V 10 Z"
					fill="#FBFAF9"
				/>
				<rect x="100" y="65" width="40" height="25" fill="#4CBE8A" />
			</svg>
			<p tw="ml-6 font-bold text-7xl text-white">usarral</p>
		</div>
	</div>`;

export async function GET() {
	const svg = await satori(markup(), ogOptions);
	const pngBuffer = new Resvg(svg).render().asPng();
	const png = new Uint8Array(pngBuffer);
	return new Response(png, {
		headers: {
			"Cache-Control": "public, max-age=31536000, immutable",
			"Content-Type": "image/png",
		},
	});
}
