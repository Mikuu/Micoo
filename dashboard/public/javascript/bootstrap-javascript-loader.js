const checkAndIncludeBootstrapJS = () => {
	const bootstrapJS = [
		"public/javascript/jquery-3.5.1.slim.min.js",
		"public/javascript/bootstrap.bundle.min.js"
	];

	const isScriptAlreadyIncluded = (src) => {
		let scripts = document.getElementsByTagName("script");
		for (let i = 0; i < scripts.length; i++) {
			if (scripts[i].getAttribute('src') === src) {
				return true;
			}
		}
		return false;
	};

	const generateJS = (src) => {
		const script = document.createElement("script");
		script.src = src;
		script.crossorigin = "anonymous";
		const body = document.getElementsByTagName("body")[0];
		body.appendChild(script);
	};

	for (const src of bootstrapJS) {
		if (!isScriptAlreadyIncluded(src)) {
			generateJS(src);
			console.log(`no ${src} in document, created it now.`);
		} else {
			console.log(`${src} already in document.`);
		}
	}
};

/**
 * usually the bootstrap JS need be loaded globally at the end of body to enable the boostrap functions, while sometimes
 * the boostrap JS need be preloaded before executing some customized JS function which interact with boostrap behavior,
 * so just dynamically load the bootstrap JS.
 * */
checkAndIncludeBootstrapJS();
