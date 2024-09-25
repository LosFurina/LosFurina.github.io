var posts=["2024/09/25/Park/","2024/09/25/CulturalPlace/","2024/09/25/GoodServices/","2024/09/25/ImportedProducts/","2024/09/25/InvestmentArt/","2024/09/25/English/","2024/09/25/Investment/","2024/09/25/Tourism/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };