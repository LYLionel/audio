require(["./config"], function() {
	require(["jquery", "draggable"], function($) {
		var arr = ['mp3/1.mp3','mp3/2.mp3','mp3/3.mp3','mp3/4.mp3','mp3/5.mp3','mp3/6.mp3','mp3/7.mp3','mp3/8.mp3','mp3/9.mp3']
		var bf = {
			init: function() {
				this.video_time();
				this.drag();
				this.drag_move();
				this.jindu();
				this.width = $('.bar_box').width();
				this.next();
				this.pre();
				this.random();
				this.order();
				this.index = +$('#video').attr('index');
				this.change_music();
			},
			video_time: function() { //监听歌曲缓存完的时间
				this.video = document.getElementById('video')
				var _this = this
				video.addEventListener('canplay', function() {
					_this.time = -~_this.video.duration; //总时间
					var minutes = ~~(-~_this.video.duration / 60) >= 10 ? ~~(-~_this.video.duration / 60) : '0' + String(~~(-~_this.video.duration / 60))
					var second = -~_this.video.duration % 60 >= 10 ? -~_this.video.duration % 60 : '0' + String(-~_this.video.duration % 60)
					$('.all_time').html(minutes + ':' + second)
					_this.video.play()
					_this.stop()
					_this.start()
					_this.move()
					_this.volume()
				})
			},
			drag: function() { //拖拽插件
				var _this = this
				var tz = document.getElementsByClassName('yd')[0]
				draggable(tz, {
					x: true,
					y: false,
					paddingRight: -12,
					callback: function(section, distance) {
						_this.left = distance.x
						$('.bar').width(_this.left)
					}
				})
			},
			stop: function() { //暂停歌曲
				var _this = this
				$('.stop').on('click', function() {
					$('.music_img').removeClass('turn')
					_this.video.pause()
					$(this).hide()
					$('.start').show()
				})
			},
			start: function() { //歌曲开始
				var _this = this
				$('.start').on('click', function() {
					$('.music_img').addClass('turn')
					_this.video.play()
					$(this).hide()
					$('.stop').show()
				})
			},
			drag_move: function() { //通过拖拽小原点到播放位置
				var _this = this
				$('.yd').on('mousedown',function(){
					_this.change = true;
				})
				$('.yd').on('mouseup', function() {
					_this.change = false;
					width = $('.bar_box').width()
					_this.f_drag_move(_this.left)
					_this.move()
					$('.start').hide()
					$('.stop').show()
					$('.music_img').addClass('turn')
				})
			},
			f_drag_move:function(a){ //歌曲播放时间计算时间
				var time = ~~(a / this.width * this.time)
					this.video.currentTime = time
					var minutes = ~~(time / 60) >= 10 ? time : '0' + String(~~(time / 60))
					var second = time % 60 >= 10 ? time % 60 : '0' + String(time % 60)
					$('.time').html(minutes + ':' + second)
			},
			move: function() { //歌曲跟着秒前进
				var _this = this 
				var timer = setInterval(function() {
					if(_this.change) clearInterval(timer); //清空定时器
					_this.now_time =-~(_this.video.currentTime)
					if(_this.now_time == _this.time){
						if(_this.on_random) _this.f_random(); //随机播放
						 _this.play_video(_this.index+1);
					}
					var minutes =~~(_this.now_time / 60) >= 10 ? _this.now_time : '0' + String(~~(_this.now_time / 60))
					var second = _this.now_time % 60 >= 10 ? _this.now_time % 60 : '0' + String(_this.now_time % 60)
					wz = ~~((_this.now_time / _this.time)*$('.bar_box').width())
					$('.bar').width(wz)
					$('.yd').css('left',wz)
					$('.time').html(minutes + ':' + second)
				}, 1000)
			},
			jindu: function(){ //点击快进歌曲
				var _this = this 
				$('.bar_box').on('click',function(ev){
					if(ev.target.className == 'bar' || ev.target.className == 'bar_box'){
						$('.bar').width(ev.offsetX)
						$('.yd').css('left',ev.offsetX)
						_this.f_drag_move(ev.offsetX)
						$('.start').hide()
						$('.stop').show()
						$('.music_img').addClass('turn')
					}
				})
			},
			volume: function(){ //音量的控制
				var _this = this
				$('.volume_box').on('click',function(ev){
					if(ev.target.className == 'volume' || ev.target.className == 'volume_box'){
						$('.volume').width(ev.offsetX)
						_this.video.volume = (~~($('.volume').width()/$(this).width()*100))/100
					}
				})
			},
			next: function(){ //下一首歌曲
				var _this = this
				$('.next').on('click',function(){
					if(_this.on_random) _this.f_random();
					_this.index = _this.index+1
					if(_this.index >= arr.length) _this.index = 0;					
					_this.play_video(_this.index)
					$('#video').attr('index',_this.index)
					$('.start').hide()
					$('.stop').show()
					$('.music_img').addClass('turn')
				})
			},
			pre: function(){ //上一首歌曲
				var _this = this
				$('.pre').on('click',function(){
					_this.index = _this.index-1
					if(_this.index < 0) _this.index = arr.length-1;
					_this.play_video(_this.index)
					$('#video').attr('index',_this.index)
					$('.start').hide()
					$('.stop').show()
					$('.music_img').addClass('turn')
				})
			},
			play_video: function(index){ //控制歌曲的播放
				if(index >= arr.length) index=0;
				this.index = index
				$('#video').attr('index',this.index)
				$('#video').attr('src',arr[index])
			},
			random: function(){ //歌曲随机
				var _this = this
				$('#random').on('click',function(){
					$(this).hide()
					$('#order').show()
					_this.on_random = true;
				})
			},
			f_random: function(){ //随机歌曲方法
				index = ~~(Math.random()*arr.length)-1
				this.index = index
				console.log(this.index)
			},
			order: function(){ //顺序歌曲
				var _this = this
				$('#order').on('click',function(){
					$(this).hide()
					$('#random').show()
					_this.on_random = false;
					
				})
			},
			change_music: function(){ //点击切歌
				var _this = this
				$('.music').on('dblclick',function(ev){
					if(ev.target.nodeName == "LI"){
						_this.play_video($(ev.target).index())
					}
				})
			}
		}
		bf.init()
	})
})