$(document).ready(function(){
	$("#form-rate").submit(function(event) {
		event.preventDefault();
		
		var like = $("#radio-like").prop("checked");
		var comment = $("#rate-comment").val();
		
		var db = prepareRatingsDB();
		saveRating(db, like, comment);
		
		getRatings(db, function(rows) {
			var domComments = $("#rating_results_comments");
			domComments.empty();
			
			for (var i = 0; i < rows.length; i++) {
				if (rows[i].comment != "") {
					var comment = $("<div>");
					comment.text(rows[i].comment);
					comment.css({
						"border-radius": "25px",
						background: ((rows[i].like=='true') ? "rgb(104, 177, 7)" : "rgb(203, 0, 0)"),
						padding: "5px 20px 5px 20px",
						margin: "10px",
						color: "#ffffff",
						"border-color": "rgb(49, 63, 102)"
					})
					domComments.append(comment);
				}
			}
		},
		function(stat) {
			var domStat = $("#rating_results_stat");
			domStat.empty();
			
			var likes = $("<div>");
			var caption = $("<strong>")
			caption.text("Likes: ");
			likes.append(caption);
			likes.append(stat.likes_count);
			var dislikes = $("<div>");
			caption = $("<strong>")
			caption.text("Dislikes: ");
			dislikes.append(caption);
			dislikes.append(stat.dislikes_count);
			
			domStat.append(likes);
			domStat.append(dislikes);
		});
		
		$("#form-rate").find('input, textarea, button, select').attr('disabled', true);
		window.setTimeout(function() {
			$("#form-rate").find('input, textarea, button, select').attr('disabled', false);
			$("#rating_results_stat, #rating_results_comments").empty();
		}, 1000 * 10);
		
		
	})
});

const DB_RATING = "rate";
const TABLE_RATING = "rating";
function prepareRatingsDB() {
  db = openDatabase(DB_RATING, '1.0', 'Offline document storage', 5*1024*1024);
  db.transaction(function(t){
      t.executeSql('CREATE TABLE IF NOT EXISTS ' + TABLE_RATING + ' (like, comment)',
    		  [],
    		  null,
    		  null);
  });
  return db;
}

function saveRating(db, like, comment) {
	db.transaction(function(t) {
		t.executeSql("INSERT INTO " + TABLE_RATING + " (like, comment) VALUES (?, ?)",
				[like, comment], null, function(t,e){console.log(e)});
	});
}

function getRatings(db, callbackRows, callbackStat) {
	db.readTransaction(function(t) {
		t.executeSql("SELECT like, comment FROM " + TABLE_RATING, [],
			function(t, data) {
				callbackRows(data.rows);
			}
		);
		t.executeSql("SELECT " + 
				"SUM(CASE WHEN like='true' THEN 1 ELSE 0 END) AS likes_count, " +
				"SUM(CASE WHEN like='false' THEN 1 ELSE 0 END) AS dislikes_count " +
				"FROM " + TABLE_RATING,
				[],
			function(t, data) {
				callbackStat(data.rows[0]);
			}, function(t, e) {console.log(e)}
		)
	})
}