import path from "path";
import { GenericContainer, Wait } from "testcontainers";

export default async function globalSetup() {
	const distPath = path.resolve(process.cwd(), "dist");

	// Serve the production build from an isolated nginx container so tests
	// always run against the real static output, independent of any local env.
	const container = await new GenericContainer("nginx:alpine")
		.withCopyDirectoriesToContainer([{ source: distPath, target: "/usr/share/nginx/html" }])
		.withExposedPorts(80)
		.withWaitStrategy(Wait.forHttp("/", 80))
		.start();

	process.env.PLAYWRIGHT_BASE_URL = `http://localhost:${container.getMappedPort(80)}`;

	// Store on global so globalTeardown (same process) can stop it explicitly.
	(global as any).__nginxContainer = container;
}
