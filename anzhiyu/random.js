var posts=["2024/09/25/Park/","2024/09/25/Tourism/","2024/09/24/hello-world/","2024/09/24/af-githubio-hexo-deploy/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };