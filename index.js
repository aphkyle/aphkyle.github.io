function getFileExtension(path){
  return path.slice((path.lastIndexOf(".") - 1 >>> 0) + 2);
}

async function dirTree(data, ul){
  for (let item of data){
    if (item.path.charAt(0) !== "."){
      let li = document.createElement("li");
      let anchor = document.createElement("a");
      anchor.setAttribute("href", `?t=${item.type}/#/${item.path}`);
      anchor.innerHTML = `${item.type === "dir" ? "📁": "📄"}${item.name}`;
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
}

window.onhashchange = async () => {
  if (window.location.hash){
    const path = window.location.hash.slice(1);
    document.querySelector("p").innerHTML = `you're now browsing '${path}'`;
    if (window.location.search === "?t=file/"){
      const response = await fetch(`https://raw.githubusercontent.com/aphkyle/aphkyle.github.io/main/${path}`);
      console.log(response);
      let fileContent = await response.text();
      let html;
      switch (getFileExtension(path)){
        case "md":
          let converter = new showdown.Converter();
          html = converter.makeHtml(fileContent);
        case "html":
          html = fileContent;
        default:
          html = `<pre><code>${fileContent}</code></pre>`;
        document.querySelector("div").outerHTML = html;
      }
    } else {
      const response = await fetch(`https://api.github.com/repos/aphkyle/aphkyle.github.io/contents/${path}`);
      const data = await response.json();
      let ul = document.querySelector("ul");
      ul.innerHTML = ""
      await dirTree(data, ul);
    }
  } else {
    const response = await fetch("https://api.github.com/repos/aphkyle/aphkyle.github.io/contents/");
    const data = await response.json();
    let ul = document.querySelector("ul");
    await dirTree(data, ul);
  }
}

window.onload = window.onhashchange