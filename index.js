//console.log("HELLO");

var datacounter = 0;
var info = data[0].split("\n");
var intervalId;
var degrees = 180 / Math.PI;

//change voting item
var changeView = function changeView(kind){
    if (kind == "next") datacounter++;
    if (kind == "prev") datacounter--;

    datacounter = (datacounter + 10) % 5;
    var bill = data[datacounter];
    d3.select("#bill").html("<h1>Spermatazoa Congressmen's Opinion On: " + name_data[datacounter] + "</h1>");
    info = bill.split("\n");

    spermSetup();
}

var spermSetup = function spermSetup(e) {
    //clear sperm
    document.getElementById("house").innerHTML = "";
    clearInterval(intervalId);

    //format data
    var counter = 0;
    while (counter != info.length){
	info[counter] = info[counter].split(",");
	counter ++;
    }
    var width = window.innerWidth,
	height = window.innerHeight / 1.7;

    var n = info.length;
    var m = 10;
   
    //init sperm with data
    counter = -1;
    var spermatozoa = d3.range(n).map(function() {
	counter++;
	//console.log(counter);
	var x = Math.random() * (width -200) + 100,
	    y = Math.random() * (height -200) + 100;
	return {
	    vx: (((width  )/2 - x) *( 1 + .05 * Math.random())) / 500,
	    vy: (((height - 100) - y) *(1 + .5 * Math.random())) / 500,
	    vy: (((100) - y) *(1 + .5 * Math.random())) / 500,
	    views: null,
	    path: d3.range(m).map(function() { return [x, y]; }),
	    count: 0,
	    id: info[counter][0],
	    state: info[counter][1],
	    district: info[counter][2],
	    vote: info[counter][3],
	    name: info[counter][4],
	    party: info[counter][5]
	};
    });

    //set up sperm moving direction
    counter = 0;
    while (counter != n){
	sperm = spermatozoa[counter];
	y = sperm.path[0][1];
	x = sperm.path[0][1];
	if (sperm.vote == "Nay")
	    sperm.vy = (((height - 100) - y) *(1 + .5 * Math.random())) / 500;
	else if (sperm.vote == "Yea")
    	    sperm.vy = (((100) - y) *(1 + .5 * Math.random())) / 500;
	else{
    	    sperm.vy = (((height )/2 - y) *( 1 + .05 * Math.random())) / 500;
	    sperm.vx += 1;}
	counter +=1;
    }

    //draw svg
    var svg = d3.select("#house").append("svg")
	.attr("width", width)
	.attr("height", height);

    //draw ellipses || eggs
    svg.append("ellipse").attr("rx", 100).attr("ry", 60).attr("cx", width /2).attr("cy", 80).attr("style","fill: #FFFFFF;");
    svg.append("ellipse").attr("rx", 100).attr("ry", 60).attr("cx", width /2).attr("cy", height - 80).attr("style","fill: #FFFFFF;");

    //add all the sperm
    var g = svg.selectAll("g")
	.data(spermatozoa)
	.enter().append("g");

    var head = g.append("ellipse")
	.attr("style",function(d){
	    if (d.party == "Republican") return "fill:#FF0000" ;
	    else if (d.party == "Democrat") return "fill:#00bfff";
	    else return "fill: green"
	})
	.attr("rx", 6.5)
	.attr("ry", 4);

    g.append("path")
	.datum(function(d) { return d.path.slice(0, 3); })
	.attr("class", "mid");

    g.append("path")
	.datum(function(d) { return d.path; })
	.attr("class", "tail");

    g.on("click", function(e) {
	var thisIndex = findIndex(this);
	displaySperm(spermatozoa[thisIndex - 2]);
    });
		       
    var tail = g.selectAll("path");

    //the part that keeps the sperm moving
    var move = function  move() {
	for (var i = -1; ++i < n;) {
	    var spermatozoon = spermatozoa[i],
		path = spermatozoon.path,
		dx = spermatozoon.vx,
		dy = spermatozoon.vy,
		x = path[0][0] += dx,
		y = path[0][1] += dy,
		speed = 1,
		count = speed * 10,
		k1 = -5 - speed / 3;

	    //stop at the walls.
	    if (((x < 100 || x > width -100) && (spermatozoon.vx < -.0000001|| spermatozoon.vx > .0000001)) || ((y < 100 || y > height -100) && (spermatozoon.vy < -.0000001 || spermatozoon.vy > .0000001)))
	    {
		if (spermatozoon.vote == "Not Voting")
		{ spermatozoon.vx *= -1; spermatozoon.vy *= -1;}
		else{
 		    spermatozoon.vx *= 0.97; 
		    spermatozoon.vy *= 0.97;}}
	    
	    // Swim!
	    for (var j = 0; ++j < m;) {
		var vx = x - path[j][0],
		    vy = y - path[j][1],
		    k2 = Math.sin(((spermatozoon.count += count) + j * 3) / 300) / speed;
		path[j][0] = (x += dx / speed * k1) - dy * k2;
		path[j][1] = (y += dy / speed * k1) + dx * k2;
		speed = Math.sqrt((dx = vx) * dx + (dy = vy) * dy);
	    }
	}

	head.attr("transform", headTransform);
	tail.attr("d", tailPath);
    };
    intervalId = setInterval(move,20);

}

//rotate head accordingly
var headTransform = function headTransform(d) {
	return "translate(" + d.path[0] + ")rotate(" + Math.atan2(d.vy, d.vx) * degrees + ")";
}

//move tail accordingly
var tailPath = function tailPath(d) {
    return "M" + d.join("L");
}

//find the index of the child to display information
var findIndex = function findIndex(child) {
    var i = 0;
    while( (child = child.previousSibling) != null ) {
	i++;
    }
    return i;
}

//display sperm info
var displaySperm = function displaySperm(sperm) {
    var change = d3.select("#chosen");
    change.html("<h2>Sperm Info</h2>" + 
		"<table>" + 
		"<tr><td>Name:</td><td>" + sperm.name+ "</td></tr>" +
	        "<tr><td>Person:</td><td>" + sperm.id + "</td></tr>" +
	        "<tr><td>State:</td><td>" + sperm.state + "</td></tr>" +
	        "<tr><td>Party:</td><td>" + sperm.party + "</td></tr>" + 
	        "<tr><td>Vote:</td><td>" + sperm.vote + "</td></tr>" +
	        "</table>");
    console.log("SHOULDA CHANGED");
}

//button events 
var next = document.getElementById("next");
next.addEventListener("click", function (e)  {
    changeView("next");
});


var prev = document.getElementById("prev");
prev.addEventListener("click", function(e) {
    changeView("prev");
});

changeView("prev");
