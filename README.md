# node-prank-server

Funny scripts you can embed in your website.

These allow you to track user activity and create alerts and prompts remotely.

# Installation and usage

1. `npm install`
2. `node index`
    Now the server is running on localhost:3001, now you should expose it (eg. using ngrok)
4. Open the prank UI at `http://localhost:3001/test`
3. Put `<script src="<host>/client.js"></script>` somewhere in your app.

## Other pranks

Giant cursor:

```css
body {
	cursor: url(content/cursor.png), default;
}
```

Play sound:

```js
var audio = new Audio('content/cartoon-sound-1.mp3');
audio.play();
```

Read text:

```js
var t = new SpeechSynthesisUtterance("OLO");
speechSynthesis.speak(t);
```

Read text content on click:

```js
document.body.addEventListener('click', e => {
	console.log(e.target.textContent);
	var t = new SpeechSynthesisUtterance(e.target.textContent);
	t.rate = 1.5;
	speechSynthesis.speak(t);
});
```

Escaping inputs:

```js
document.querySelectorAll('input').forEach(e => {
	let x = 0, y = 0, a, b, r, i, p=()=>Math.random()>0.5?-1:1;
	(true /*or random Math.random() < 0.1*/) && (
		e.addEventListener('mousemove', (ev) => (
			!i && (a=p(), b=p(), i=setInterval(() => (
				r = e.getBoundingClientRect(),
				ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom ? e.style.transform = `translate(${x+=a}px, ${y+=b}px)` : (clearInterval(i),i=0)
			), 2))
		)), console.log('did it', e)
	)
});
```

Slowly type in text in inputs:

```js
document.querySelectorAll('input').forEach(e => {
	e.addEventListener('keyup', () => {
		[...' after clicking'].forEach((l, i) => setTimeout(() => e.value += l, i * 250));
	});
});
```

Let it snow ([source](https://gist.github.com/trentmwillis/2199d6d191000b8d8f40)):

```js
(function(){var s=[],mAngle=0,an;function grn(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function c(){var el=document.createElement('div'),style=el.style;style.borderRadius='100%';style.border=grn(1,4)+'px solid white';style.position='fixed';style.zIndex='999999';style.boxShadow='0 0 2px rgba(255,255,255,0.8)';style.top=grn(0,window.innerHeight)+'px';style.left=grn(0,window.innerWidth)+'px';return el;}
function ms(){var l=s.length,i;mAngle+=0.01;for(i=0;i<l;i++){m(s[i]);}}
function m(el){var style=el.style,height=window.innerHeight,radius,top;radius=parseInt(style.border,10);top=parseInt(style.top,10);top+=Math.cos(mAngle)+1+radius/2;if(top>height){rst(el);}else{style.top=top+'px';}}
function rst(el){var style=el.style;style.top='0px';style.left=grn(0,window.innerWidth)+'px';}
function x(){var number=677,p,i;for(i=0;i<number;i++){p=s[i]=c();document.body.appendChild(p);}
an=setInterval(ms,33);}
x();}
());
```