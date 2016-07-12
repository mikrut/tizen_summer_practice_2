const MY_FILE = "myNewFile.txt";

function writeFunc() {
	try {
		getFile(true, function(file){
			file.openStream('rw',
					function(fs){
				console.log("writing...");
				fs.write($("#files-content").val());
				fs.close();
			})
		});
	} catch(err) {
		console.log(err);
	}
	return false;
}

function readFunc() {
	try {
		getFile(false, function(file){
			file.openStream('r',
					function(fs){
				console.log("reading...");
				$("#files-content").val(fs.read(fs.bytesAvailable));
				fs.close();
			})
		});
	} catch(err) {
		console.log(err);
	}
	return false;
}

function dofile(documentsDir, callback) {
	
}

function getFile(overwrite, callback) {
		console.log("getting a file...")
		tizen.filesystem.resolve("documents", function(result) 
            {
               documentsDir = result;
               
               try {
             	   myFile = documentsDir.resolve(MY_FILE);
             	   console.log("resolved successfully!");
             	   console.log(myFile);
             	  
             	   if (overwrite) {
	           		   console.log("deleting");
	               	   documentsDir.deleteFile(myFile.fullPath, function(){
	               		   console.log("deleted");
	               		   myFile = documentsDir.createFile(MY_FILE);
	               		   callback(myFile);
	               	   }, function(err) {
	               		   console.log("error deleting file");
	               		   console.log(err);
	               		   callback(myFile);
	               	   });
	           	   } else {
	           		 callback(myFile);
	           	   }
                } catch (err) {
             	   console.log('Cannot resolve file');
             	   console.log(err);
             	   myFile = documentsDir.createFile(MY_FILE);
             	   console.log("Created a new file");
             	   callback(myFile);
                }
                
               
            
            }, console.log);
}