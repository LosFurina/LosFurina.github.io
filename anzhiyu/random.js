var posts=["2024/09/25/Tourism/","2024/09/25/Garden/","2024/09/24/af-githubio-hexo-deploy/","2024/09/24/hello-world/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };