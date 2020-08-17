// https://xem.github.io/miniCodeEditor/#
// const miniCodeEditor =
//     '<body id=e><a href=..>Home</a><script>for(i=4;--i;)e.innerHTML+="<textarea id=t"+i+" placeholder="+[,"JS","CSS","HTML"][i]+" rows=9 onkeydown=\'if((K=event).keyCode==9){K.preventDefault();s=this.selectionStart;this.value=this.value.substring(0,this.selectionStart)+\\"\\t\\"+this.value.substring(this.selectionEnd);this.selectionEnd=s+1}\'>"+(unescape((l=location).hash.slice(1,-1)).split("\\x7F")[i-1]||"");onload=onkeyup=function(a){q=[(E=escape)(j=t1[v="value"]),E(c=t2[v]),E(h=t3[v])].join("\\x7f")+1;(H=history)&&H.replaceState?H.replaceState(0,0,"#"+q):location.hash=q;I=h||c||j?h+"<script>"+j+"<\\/script><style>"+c:"<pre>Result";navigator.userAgent.match(/IE|Tr/)?((D=e.lastChild.contentWindow.document).write(I),D.close()):frames[0].location.replace("data:text/html,"+escape(I))}</script><style>html,body{height:100%}*{box-sizing:border-box;-moz-box-sizing:border-box;margin:0;vertical-align:top}textarea,iframe{border:1px solid}textarea{resize:none;width:33.333%;height:40%;*width:32%}iframe{width:100%;height:60%}a{position:absolute;bottom:0;right:0;background:#555;color:#fff;text-decoration:none;padding:0px 5px}</style><iframe>'
const miniCodeEditor =
    '<iframe id=f></iframe><textarea placeholder="HTML" oninput=f.srcdoc=value rows=9></textarea><style>html,body{height:100%}*{box-sizing:border-box;-moz-box-sizing:border-box;margin:0;vertical-align:top}textarea,iframe{border:1px solid}textarea{resize:none;width:100%;height:40%;*width:32%}iframe{width:100%;height:60%}a{position:absolute;bottom:0;right:0;background:#555;color:#fff;text-decoration:none;padding:0px 5px}</style>'
// https://github.com/xem/postit/
const postit = `<body id=b contentEditable onload=b[i="innerHTML"]=[(l=localStorage).c] oninput=l.c=b[i]>`
// https://github.com/xem/paste/
const paste = `<body contenteditable onload=b[i='innerHTML']=unescape(location.hash.slice(1,-1)) oninput=history.replaceState(0,0,"#"+escape(b[i]+1)) id=b>`

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

/**
 * Send HTML
 * @param {Request} request
 */
async function handleRequest(request) {
    return new Response(miniCodeEditor, {
        headers: {
            'content-type': 'text/html;charset=UTF-8',
            'cache-control': 'max-age=2592000',
        },
    })
}

//'cache-control': 'max-age=2592000'
