var posts=["2024/09/25/Park/","2024/09/25/Investment/","2024/09/25/Tourism/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };