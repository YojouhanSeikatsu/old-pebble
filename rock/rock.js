let db;

function newPost() {
    showPopUp("New Post", `
        Title: <input type="text" id="post-title" maxlength="200"><hr>
        <textarea id="post-body" maxlength="1500" rows="10"></textarea>
    `);
}

function search() {
    const sortby = document.getElementById("sortby").value;

    if (sortby === "last-comment") {
        db.ref("posts").orderByChild("last-comment").once("value", function(post_object) {
            post_object.forEach(function(posts) {
                var post = document.createElement("div");
                post.setAttribute("class", "topic")

                var title = document.createElement("div");
                title.setAttribute("class", "title");
                title.innerHTML = posts.val().title.slice(0, 100);

                post.appendChild(title);
                post.appendChild(document.createElement("hr"));

                var body = document.createElement("div");
                body.setAttribute("class", "body");
                body.innerHTML = posts.val().body.slice(0, 500);

                post.addEventListener("click", function() {
                    showPopUp("Post", `
                        <h2>${posts.val().title}</h2>
                        <hr>
                        ${posts.val().body}
                        <hr>
                    `);
                })

                post.appendChild(body);

                document.getElementById("main").appendChild(post);
            })
        })
    }
}

function setup() {
    db.ref(`users/${getUsername()}`).once('value', function(object) {
        if (!object.exists() || object.val().password !== getPassword() || (object.val().muted || false) || (object.val().trapped || false) || Date.now() - (object.val().sleep || 0) < 0) {
            document.body.innerHTML = `<h1>Unknown error occurred. Either you are removed, muted, trapped, timed out, etc</h1><button onclick="window.location.replace('../pebble/pebble.html?ignore=true')">Pebble</button>`;
            db.goOffline();
            return;
        }

        search();
    })
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
