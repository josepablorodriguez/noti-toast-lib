# Noti-Toast
Noti Toast is a light-weight library to present toast messages and push notifications.

## Installation
You can currently fork the library, clone it, or download it.

## Usage

### HTML
Your **index.html** file
```html
<!doctype html>
<html lang="en">
<head>
    <link rel="stylesheet" href="./noti-toast.css"> <!-- where the Noti-Toast .css file is located -->
    <script type="module" defer src="script.js"></script>
    <title>noti-toast-lib DEMO</title>
</head>
<body>
    <main>
        <button id="btn-1">Show Noti-Toast #1</button>
        <button id="btn-2">Show Noti-Toast #2</button>
    </main>
</body>
</html>
```
Noti-Toast is a module library, for that reason the type of the script tag is **module** instead of **text/javascript**.
### Javascript
Your **script.js** file
```javascript
import NotiToast from "/noti-toast.js"; // where the Noti-Toast .js file is located

let button1 = document.querySelector('button#btn-1'),
    button2 = document.querySelector('button#btn-1'),
    notiToast_config = { // create the Noti-Toast configuration
        position: 'top-right',
        text: 'Hello, world!',
    },
    notiToast;
button1.addEventListener('click', ()=>{
    // create a new Noti-Toast object
    notiToast = new NotiToast(notiToast_config);
});
button2.addEventListener('click', ()=>{
    // set HTML content to add to the Noti-Toast
    notiToast_config.html = '<div><u>Title</u></div><div>Content Here!</div>';
    // define duration in milliseconds
    notiToast_config.autoClose = 5000;
    // update the Noti-Toast object already created
    notiToast.update(notiToast_config);
    // NOTE: the HTML property takes presedence over the TEXT property
});
```

## Demo
[Go to Demo](https://google.com)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Sources
Noti Toast is built over the base code from:

1. [WebDevSimplyfied](https://github.com/WebDevSimplified/live-toast-notification-library)
2. [Lamberta](https://gist.github.com/lamberta/3768814)

### License
[MIT](https://choosealicense.com/licenses/mit/)