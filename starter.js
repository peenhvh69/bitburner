/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog('ALL');
	ns.clearLog();

	ns.tail();

	let servers = serverList(ns);
	let target = ns.args[0];

	ns.print(target);
	await ns.sleep(750);

	ns.print('INFO: Security Level - ' + ns.getServerSecurityLevel(target));
	await ns.sleep(750);

	ns.print('INFO: Minimum Security Level - ' + ns.getServerMinSecurityLevel(target));
	await ns.sleep(750);

	ns.print('INFO: Server Growth - ' + ns.getServerGrowth(target));
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

	for (const server of servers) {
		// Grab the threads that are currently available.
		var availableThreads = Math.floor((ns.getServerMaxRam(server) / ns.getScriptRam('virus.js'))) <= 0 ? 1 : Math.floor((ns.getServerMaxRam(server) / ns.getScriptRam('virus.js')));

		// This is useless since our file does this already.
		// Kill all running scripts on the server.
		ns.killall(server);

		// Some simple checks.
		if (ns.fileExists('BruteSSH.exe')) ns.brutessh(target);
		if (ns.fileExists('FTPCrack.exe')) ns.ftpcrack(target);
		if (ns.fileExists('HTTPWorm.exe')) ns.httpworm(target);
		if (ns.fileExists('relaySMTP.exe')) ns.relaysmtp(target);
		if (ns.fileExists('SQLInject.exe')) ns.sqlinject(target);

		ns.nuke(target);

		// Calling SCP to move our file to the server.
		ns.scp('virus.js', server);

		// Run the file on the server, set the threads to use and our target.
		ns.exec('virus.js', server, availableThreads, target);
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