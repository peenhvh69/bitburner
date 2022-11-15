/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog('ALL');
	ns.clearLog();

	ns.tail();

	let servers = serverList(ns);

	// Sort the servers by the max memory they have.
	servers.sort((a, b) => ns.getServerMaxRam(b) - ns.getServerMaxRam(a));

	let usableServers = servers.filter(serv => ns.hasRootAccess(serv) && ns.getServerMaxRam(serv) > 0);
	let cracks = availablePortOpeners(ns);
    let numCracksAvailable = cracks.length;

	ns.tprint(usableServers);

	ns.print(ns.args[0]);
	await ns.sleep(750);

	ns.print('INFO: Sever count - ' + servers.length);
	await ns.sleep(750);

	ns.print('INFO: Usable server count - ' + usableServers.length);
	await ns.sleep(750);

	ns.print('INFO: Cracks available - ' + numCracksAvailable);
	await ns.sleep(750);

	ns.print('INFO: Security Level - ' + ns.getServerSecurityLevel(ns.args[0]));
	await ns.sleep(750);

	ns.print('INFO: Minimum Security Level - ' + ns.getServerMinSecurityLevel(ns.args[0]));
	await ns.sleep(750);

	ns.print('INFO: Server Growth - ' + ns.getServerGrowth(ns.args[0]));
	await ns.sleep(750);

	if (!ns.fileExists('virus.js')) {
		ns.print('INFO: Downloaded virus.js.');
		ns.wget('https://raw.githubusercontent.com/peenhvh69/bitburner/main/virus.js', 'virus.js');
		await ns.sleep(750);
	}

	if (!ns.fileExists('BruteSSH.exe')) {
		ns.print('WARN: BruteSSH.exe not found.');
		await ns.sleep(750);
	}

	if (!ns.fileExists('FTPCrack.exe')) {
		ns.print('WARN: FTPCrack.exe not found.');
		await ns.sleep(750);
	}

	if (!ns.fileExists('HTTPWorm.exe')) {
		ns.print('WARN: HTTPWorm.exe not found.');
		await ns.sleep(750);
	}

	if (!ns.fileExists('relaySMTP.exe')) {
		ns.print('WARN: relaySMTP.exe not found.');
		await ns.sleep(750);
	}

	if (!ns.fileExists('SQLInject.exe')) {
		ns.print('WARN: SQLInject.exe not found.');
		await ns.sleep(750);
	}

	// Get our script's ram we'll use this later.
	const scriptRam = ns.getScriptRam('virus.js');

	for (const server of usableServers) {
		if (server == 'home') continue;

		// Calculate the ram that is at our disposal.
		let availableRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);

		// Grab the threads that are currently available.
		var availableThreads = Math.floor(availableRam / scriptRam);

		// Check if the server is already maxxed out.
		if (availableThreads <= 0)
			return;

		// Calling SCP to move our file to the server.
		await ns.scp('virus.js', server);

		// This is useless since our file does this already.
		// Kill all running scripts on the server.
		ns.killall(server);

		// Some simple checks.
		if (ns.fileExists('BruteSSH.exe')) ns.brutessh(server);
		if (ns.fileExists('FTPCrack.exe')) ns.ftpcrack(server);
		if (ns.fileExists('relaySMTP.exe')) ns.relaysmtp(server);
		if (ns.fileExists('HTTPWorm.exe')) ns.httpworm(server);
		if (ns.fileExists('SQLInject.exe')) ns.sqlinject(server);

		ns.nuke(server);

		// Run the file on the server, set the threads to use and our target.
		ns.exec('virus.js', server, availableThreads, ns.args[0]);
	}

	while (true) {
		// If virus.js exists remove it since we put it on the servers.
		if (ns.fileExists('virus.js')) ns.rm('virus.js');

		// You can comment this out to make the script end.
		await ns.sleep(5);
	}
}

function serverList(ns) {
    let servers = ['home'];

    for (const server of servers) {
        const found = ns.scan(server);
        if (server != 'home') found.splice(0, 1);
        servers.push(...found);
    }

    return servers;
}

function availablePortOpeners(ns) {
    const cracklist = [
        ["BruteSSH.exe", ns.brutessh],
        ["FTPCrack.exe", ns.ftpcrack],
        ["SQLInject.exe", ns.sqlinject],
        ["relaySMTP.exe", ns.relaysmtp],
        ["HTTPWorm.exe", ns.httpworm],
    ];

    let availableCracks = [];

    for (const crack of cracklist) {
        if (ns.fileExists(crack[0])) { availableCracks.push(crack[1]) }
    }

    return availableCracks;
}