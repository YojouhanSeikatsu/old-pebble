function newPost() {
    showPopUp("New Post", `
        Title
    `);
}

window.onload = function() {
    try {
        const config = {
            apiKey: "AIzaSyAsp44iKOav3dbHrViABHETRmAnRtQnVwA",
            authDomain: "chatter-97e8c.firebaseapp.com",
            databaseURL: "https://chatter-97e8c-default-rtdb.firebaseio.com",
            projectId: "chatter-97e8c",
            storageBucket: "chatter-97e8c.firebasestorage.app",
            messagingSenderId: "281722915171",
            appId: "1:281722915171:web:3b136d8a0b79389f2f6b56",
            measurementId: "G-4CGJ1JFX58"
        };
        firebase.initializeApp(config);
        db = firebase.database();

        const script = document.createElement('script');
        script.src = '../config.js';
        if (typeof(window.APPCHECK) !== "undefined") {
            self.FIREBASE_APPCHECK_DEBUG_TOKEN = window.APPCHECK;
        }

        const appCheck = firebase.appCheck();
        appCheck.activate('6LdCtT0rAAAAAMLtV7TbvgzemnHKbw28Ev8IzXyA', true, { provider: firebase.appCheck.ReCaptchaV3Provider });

        fetch('https://us-central1-pebble-rocks.cloudfunctions.net/api/getInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: typeof(window.APPCHECK) !== "undefined" ? window.APPCHECK : null
        })
        .then(response => response.json())
        .then(data => {
            if (data.version === curr_version) {
                setup();
            } else {
                document.body.innerHTML = `An error has occured. You are most likely using an outdated version of the site. Fetch a new version by pressing "ctrl + shift + R" or "ctrl + f5<br>
                Newest Version: ${data.version}<br>
                Your Version: ${curr_version}`;
            }
        })
    } catch(err) {
        alert(err);
    }
};
