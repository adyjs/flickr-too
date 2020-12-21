window.onload = function(){
	randomDisplay.getRandomImageInfo();
	document.getElementById("search-div").addEventListener("keyup" , search.enter , false);
	document.getElementById("search-span").addEventListener("click" , search.clicked , false);
	document.getElementById("next-page-btn").addEventListener("click" , search.nextPageSearch , false);
	document.getElementById("back-top-btn").addEventListener("click" , search.effectHandler.backTopBtn.backTop , false);
	document.getElementById("main-section-ul").addEventListener("click" , search.effectHandler.zoom.zoomAction , false);
	document.getElementById("prev").addEventListener("click" , search.effectHandler.zoom.prevImage , false);
	document.getElementById("next").addEventListener("click" , search.effectHandler.zoom.nextImage , false);
	document.getElementById("close").addEventListener("click" , search.effectHandler.zoom.close , false);
}

var randomDisplay = (function(){
	var apiKey = yeah || null;
	var perPage = 15;
	var currentPage = "";
	var initialUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.search&nojsoncallback=1&format=json&api_key="+apiKey+"&per_page="+perPage;
	var retrieveUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+apiKey+"&format=json&nojsoncallback=1";
	var valve = 15;
	var searchWordArray = ["mountain","sea","landscope","forest","river","sea surfing","Metropolis"];
	var searchWord = "";
	return {
		fail : function(){
			var errorMsg = "<h3 class=\"fail-msg\" id=\"fail\">與遠端伺服器傳輸發生問題，可能是本地端網路、搜尋資料或 API 相關問題</br>請聯絡管理員。</h3>";
			var ul = document.getElementById("main-section-ul");
			ul.insertAdjacentHTML("afterbegin" , errorMsg);
		},
		abortAjax : function(){
			valve = 100;
		},
		getRandomImageInfo : function(){
			var index = Math.floor(Math.random() * (searchWordArray.length - 1));
			searchWord = searchWordArray[index];
			$.ajax({
				url:initialUrl+"&text="+searchWord+"&page="+currentPage,
				method:"GET",
				dataType:"json"
			})
			.then(
				function(data){
					if(data.stat === "ok"){
						currentPage = Math.floor(Math.random() * data.photos.pages) + 1;
						randomDisplay.retrieveImage(data.photos.photo);	
					}
				},
				function(){
					randomDisplay.fail();
				}
			)
			.always(function(){})
		},
		retrieveImage : function(photoArr){
			var count = 0;
			var targets = document.querySelectorAll('.target');
			photoArr.map(function( obj , index ){
				$.ajax({
					url:retrieveUrl+"&photo_id="+obj.id,
					method:"GET",
					dataType:"json"
				})
				.then(
					function(data){
						if( data.sizes.size[6] && data.sizes.size[6].url && data.sizes.size[6].source ){
							var albumUrl = data.sizes.size[6].url;
							var imageUrl = data.sizes.size[6].source;

							var anchor = document.createElement("A");
							anchor.href = albumUrl.substring( 0 , albumUrl.indexOf("sizes")-1);
							anchor.rel="noreferrer noopener";
							anchor.target = "_blank";
							var img = new Image();
							img.className = "main-section-img";
							img.src = imageUrl;
							anchor.appendChild(img);
							img.addEventListener("load" , function(){
								try{
									if(targets[index].children[0]){
										targets[index].replaceChild(anchor , targets[index].children[0])
									}
									else{
										targets[index].appendChild(anchor);
									}
								}
								catch(e){}
							},false)
						}
					},
					function(){
						randomDisplay.fail();
					}
				)
				.always(function(){
					count++;
					if(count === valve ){
						setTimeout( function(){ randomDisplay.getRandomImageInfo()} , 3500 );
						count = 0;
					}
				})
			})
		}
	};
})();

var search = (function(){
	var apiKey = yeah || null;
	var searchWord = null;
	var perPage = 50;
	var currentPage = "";
	var pages = null;
	var resultNum = "";
	var initialUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.search&nojsoncallback=1&format=json&api_key="+apiKey;
	var zoomImageId = "";
	var zoomUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+apiKey+"&format=json&nojsoncallback=1";
	var zoomOrigin = "";
	return {
		effectHandler : {
			loaderSceneOn : function(){
				document.getElementById("overlay").style.display = "block";
			},
			loaderSceneOff : function(){
				document.getElementById("overlay").style.display = "none";
			},
			initialSearchClicked : function( searchWord , resultNum ){
				randomDisplay.abortAjax();
				document.getElementById("main-section-ul").innerHTML = "";
				document.getElementById("result-board").style.display = "block";
				document.getElementById("search-word").textContent = searchWord;
				document.getElementById("response-result-num").textContent = resultNum;
			},
			normalResult : {
				greaterThanPerPage : function(){
					search.effectHandler.nextPageClicked.nextPageBtnRestore();
					search.effectHandler.nextPageClicked.nextPageBtnShow();
					search.effectHandler.backTopBtn.backTopBtnSHow();
				},
				lessThanPerPage : function(){
					search.effectHandler.nextPageClicked.nextPageBtnRestore();
					search.effectHandler.nextPageClicked.nextPageBtnHidden();
					search.effectHandler.backTopBtn.backTopBtnSHow();
				},
				zeroResult : function(){
					search.effectHandler.nextPageClicked.nextPageBtnRestore();
					search.effectHandler.nextPageClicked.nextPageBtnHidden();
					search.effectHandler.backTopBtn.backTopBtnHidden();
				},
			},
			fail : function(){
				var errorMsg = "<h3 class=\"fail-msg\" id=\"fail\">與遠端伺服器傳輸發生問題，可能是本地端網路、搜尋資料或 API 相關問題</br>請聯絡管理員。</h3>";
				document.getElementById("main-section-ul").innerHTML = errorMsg;
				search.effectHandler.nextPageClicked.nextPageBtnHidden();
				search.effectHandler.nextPageClicked.nextPageBtnFreeze();
			},
			nextPageClicked : {
				nextPageBtnFreeze : function(){
					document.getElementById("next-page-btn").disabled = true;
				},
				nextPageBtnRestore : function(){
					document.getElementById("next-page-btn").disabled = false;
				},
				nextPageBtnShow : function(){
					document.getElementById("next-page-btn").style.display = "block";
				},
				nextPageBtnHidden : function(){
					document.getElementById("next-page-btn").style.display = "none";
				}
			},
			backTopBtn : {
				backTopBtnSHow : function(){
					document.getElementById("back-top-btn").style.display = "block";
				},
				backTopBtnHidden : function(){
					document.getElementById("back-top-btn").style.display = "none";
				},
				backTop : function(){
					window.scrollTo( 0 , 0);
				}
			},
			zoom : {
				zoomAction : function(e){
					if(e.target.textContent === "Zoom"){
						zoomOrigin = e.target.parentNode;
						zoomImageId = zoomOrigin.id;
						search.effectHandler.zoom.zoomIn();
					}
				},
				zoomIn : function(){
						$.ajax({
							url 	: zoomUrl+"&photo_id="+zoomImageId,
							method	: "GET",
							dataType: "json"
						})
						.then(
							function(data, textStatus, jqXHR){
								if( data.stat === "ok"  ){
									var zoomInFrame = document.getElementById("zoom-in-frame");
									zoomInFrame.parentNode.style.display = "inline-block";
									var img = new Image();
									var imageSource = data.sizes.size[7] || data.sizes.size[6] || data.sizes.size[5] || data.sizes.size[4] || data.sizes.size[3] || data.sizes.size[2] || data.sizes.size[1] || data.sizes.size[0];
									img.src = imageSource.source;
									img.addEventListener("load" , function(){
										if(zoomInFrame.children[0]){
											zoomInFrame.replaceChild(img , zoomInFrame.children[0])
										}
										else{
											zoomInFrame.appendChild(img);
										}
									}, false)
									
								}
							},
							function(jqXHR, textStatus, errorThrown ){

							}
						)
				},
				prevImage : function(){
					try{
						var previousSibling = zoomOrigin.previousSibling;
						zoomOrigin = previousSibling;
						zoomImageId = zoomOrigin.id;
						document.getElementById("zoom-in-frame").innerHTML = "";
						search.effectHandler.zoom.zoomIn();
					}
					catch(e){
						search.effectHandler.zoom.close();
					}
				},
				nextImage : function(){
					try{
						var nextSibling = zoomOrigin.nextSibling;
						zoomOrigin = nextSibling;
						zoomImageId = zoomOrigin.id;
						document.getElementById("zoom-in-frame").innerHTML = "";
						search.effectHandler.zoom.zoomIn();
					}
					catch(e){
						search.effectHandler.zoom.close();
					}
				},
				close : function(){
					document.getElementById("zoom-in-container").style.display = "none";
					document.getElementById("zoom-in-frame").innerHTML = "";
				}
			}
		},
		enter : function(e){
			if(e.key === "Enter"){search.clicked();}
		},
		clicked : function(){
			var input = document.getElementById("search-input").value || "" ;
			if(input){
				search.effectHandler.loaderSceneOn();
				searchWord = input;
				perPage = document.getElementById("item-num").value || 50;
				search.initialSearch();
			}
		},
		initialSearch : function(){
			$.ajax({
				url 	: initialUrl+"&text="+searchWord+"&per_page="+perPage,
				method	: "GET",
				dataType: "json"
			})
			.then(
				/*拿到圖片物件陣列之後，傳給retrieveRealImagee再發第二次 GET ajax*/
				/*done then*/
				function( data, textStatus, jqXHR ) {
					if(data.stat === "ok"){
						pages = data.photos.pages;
						resultNum = data.photos.total;
						currentPage = data.photos.page;
						search.effectHandler.initialSearchClicked( searchWord , resultNum );

						if(currentPage < pages){
							search.effectHandler.normalResult.greaterThanPerPage();
							search.retrieveRealImage(data.photos.photo);
						}
						else if(currentPage === pages){
							search.retrieveRealImage(data.photos.photo);
							search.effectHandler.normalResult.lessThanPerPage();
						}
						else{
							search.effectHandler.normalResult.zeroResult();
						}
					}
					else{
						search.effectHandler.fail();
					}
				},
				/*fail then*/
				function( jqXHR, textStatus, errorThrown ) {
					search.effectHandler.fail();
				}
			)
			.always(function(){
				search.effectHandler.loaderSceneOff();
			})
		},
		nextPageSearch : function(){
			search.effectHandler.nextPageClicked.nextPageBtnFreeze();
			search.effectHandler.loaderSceneOn();
			$.ajax({
				url 	: initialUrl+"&text="+searchWord+"&per_page="+perPage+"&page="+(++currentPage),
				method	: "GET",
				dataType: "json"
			})
			.then(
				/*拿到圖片物件陣列之後，傳給retrieveRealImagee再發第二次 GET ajax*/
				/*done then*/
				function( data, textStatus, jqXHR ) {
					if(data.stat === "ok"){
						search.effectHandler.loaderSceneOff();
						pages = data.photos.pages;
						resultNum = data.photos.total;
						currentPage = data.photos.page;

						if(currentPage < pages){
							search.effectHandler.normalResult.greaterThanPerPage();
							search.retrieveRealImage(data.photos.photo);
						}
						else if(currentPage === pages){
							search.retrieveRealImage(data.photos.photo);
							search.effectHandler.normalResult.lessThanPerPage();
						}
						else{
							search.effectHandler.normalResult.zeroResult();
						}
					}
					else{
						search.effectHandler.fail();
					}
				},
				/*fail then*/
				function( jqXHR, textStatus, errorThrown ) {
					search.effectHandler.fail();
				}
			)
			.always(function(){
				search.effectHandler.loaderSceneOff();
			})
		},
		retrieveRealImage : function( photoArr ){
			var ul = document.getElementById("main-section-ul");
			photoArr.map(function( obj , index){
				/*用 map 拿陣列中每個圖片物件的詳細資料*/
				var liTemplate  = "<li id=\""+obj.id+"\" class=\"size-square\"></li>";
				ul.insertAdjacentHTML("beforeend" , liTemplate);
				$.ajax({
					url 	: "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+apiKey+"&photo_id="+obj.id+"&format=json&nojsoncallback=1",
					method	: "GET",
					dataType: "json"
				})
				.then(
					function(data, textStatus, jqXHR){
						if(data.stat === "ok"){
							var liTemplate = document.getElementById(obj.id);
							var albumUrl = data.sizes.size[1].url;
							var imageUrl = data.sizes.size[1].source;
							var anchor = document.createElement("A");
							anchor.href = albumUrl.substring( 0 , albumUrl.indexOf("sizes")-1);
							anchor.rel="noreferrer noopener";
							anchor.target = "_blank";
							anchor.textContent = "Album";
							var span = document.createElement("SPAN");
							span.textContent = "Zoom";
							var img = new Image();
							img.className = "main-section-img";
							img.src = imageUrl;
							//anchor.appendChild(img);
							img.addEventListener("load" , function(){
								if(liTemplate.children[0]){
									liTemplate.replaceChild(img , liTemplate.children[0])
								}
								else{
									liTemplate.appendChild(img);
									liTemplate.appendChild(anchor);
									liTemplate.appendChild(span);
								}
							},false);
						}
					}, 
					function( jqXHR, textStatus, errorThrown ) {}
				)
				.always(function(){
					search.effectHandler.loaderSceneOff();
				})
			})
		}
	};
}())