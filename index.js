function getFileExtension(path){
  return path.slice((path.lastIndexOf(".") - 1 >>> 0) + 2);
}

async function dirTree(data, ul){
  for (let item of data){
    if (item.path.charAt(0) !== "."){
      let li = document.createElement("li");
      let anchor = document.createElement("a");
      anchor.setAttribute("href", `/#/${item.path}`);
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
    document.querySelector("p").innerHTML = `you're now browsing '${decodeURI(path)}'`;

    const response = await fetch(`https://api.github.com/repos/aphkyle/aphkyle.github.io/contents/${path}`);
    var hashchangedata = await response.json();
    if (Array.isArray(hashchangedata)){
      const response = await fetch(`https://raw.githubusercontent.com/aphkyle/aphkyle.github.io/main${decodeURI(path)}`);
      console.log(response);
      let fileContent = await response.text();
      let html;
      // FILE TYPES
      switch (getFileExtension(path)){
        case "md":
          let converter = new showdown.Converter();
          converter.setOption('simpleLineBreaks', true);
          converter.setOption('tables', true);
          html = `<div style="color: white;">${converter.makeHtml(fileContent)}</div>`;
          console.log(html)
          break;
        case "pdf":
          window.location.href = `https://raw.githubusercontent.com/aphkyle/aphkyle.github.io/main${path}`
          break;
        default:
          html = fileContent;
          break;
      }
      document.querySelector("div").outerHTML = html;
      // FILE TYPES==END
    } else {
      let ul = document.querySelector("ul");
      ul.innerHTML = ""
      await dirTree(hashchangedata, ul);
    }
  } else {
    // if dir
    const response = await fetch("https://api.github.com/repos/aphkyle/aphkyle.github.io/contents/");
    const data = await response.json();
    let ul = document.querySelector("ul");
    await dirTree(data, ul);
  }
}

window.onload = window.onhashchange