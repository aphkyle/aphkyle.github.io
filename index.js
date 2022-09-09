async function dirTree(data, ul){
  for (let item of data) {
    let li = document.createElement("li");
    let anchor = document.createElement("a");
    anchor.setAttribute("href", `#/${item.path}`);
    anchor.innerHTML = item.name;
    li.append(anchor);
    ul.append(li);

    if (item.type === "dir"){
      const response = await fetch(item.url);
      const innerData = await response.json();
      let innerUl = document.createElement("ul");
      li.append(innerUl);
      dirTree(innerData, innerUl);
    }
  }
}

window.onhashchange = async () => {
  if (window.location.hash){
    const path = window.location.hash.slice(1);
    const response = await fetch(`https://raw.githubusercontent.com/aphkyle/aphkyle.github.io/main/${path}`);
    let fileContent = await response.text();
    let html;
    switch (path.slice((path.lastIndexOf(".") - 1 >>> 0) + 2)){
      case "md":
        let converter = new showdown.Converter();
        html = converter.makeHtml(fileContent);
      case "html":
        html = fileContent;
      default:
        html = `<pre><code>${fileContent}</code></pre>`;
      document.querySelector("body").innerHTML = html;
    }
  } else {
    document.querySelector("body").innerHTML = `\
<a href="https://github.com/aphkyle/"><img src="https://avatars.githubusercontent.com/u/81857274?s=400&v=4" width="50" style="border-radius: 30%;"></img>aphkyle's boring site </a>
<p>welcome to my boring homepage, less is more.. right?</p>
<ul></ul>`;
    const response = await fetch("https://api.github.com/repos/aphkyle/aphkyle.github.io/contents/");
    const data = await response.json();
    let ul = document.querySelector("ul");
    await dirTree(data, ul);
  }
}

window.onload = async () => {
  if (!window.location.hash){
    const response = await fetch("https://api.github.com/repos/aphkyle/aphkyle.github.io/contents/");
    const data = await response.json();
    let ul = document.querySelector("ul");
    await dirTree(data, ul);
  }
}
