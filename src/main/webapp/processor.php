
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<title>Datalyze</title>
	<meta name="description" content="Datalyze." />
	<meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
	<link rel="canonical" href="http://batchgeo.com/" />
		<link href="style.css" rel="stylesheet" type="text/css">
		<meta name="viewport" content="initial-scale=1.0, width=device-width" />
	<link rel="apple-touch-icon" href="images/favicon.ico"/>
	<link rel="shortcut icon" href="images/favicon.ico" />
	</head>
    
    
<body>
  <div id="header">
    <div id="header-inner" class="wrap clearfix">
	 <div id="logo" class="fourcol first">
        <img src="images/logo.jpg" width="300px" alt="Datalyze" style="margin-top:-17px;" />
     <p style="    margin-top: -20px;    margin-left: 27px;    font-size: 12px;    color: #626262;">You bring the data, we bring the understanding.</p>
      </div>
      <div class="nav fourcol">
      	<a class="current" href="#">Datalyze</a>
		<a href="panes.html">Panes</a>
      	<a href="pro.html">Pro</a>
      	<a href="help.html">Help</a>
      </div>
    </div>
  </div>
  
  <div id="generator">
    <div class="wrap">
    	   <center> <form id="geocodeForm" method="post" name="geocodeForm" action="">
           

<?php

$data = $_POST['data'];

$rows = explode('
', $data);

foreach ($rows as $id => $array)
	{$rows[$id] = explode('	', $array);}

$fp = fopen('data.csv', 'w');

foreach ($rows as $fields) {
    fputcsv($fp, $fields);
}

fclose($fp);

exec("Rscript datalyze.R");

while(!file_exists("gifone.gif"))
	{sleep(1);}

?>
<table>
	<tr>
		<td><img src='gifone.gif'></td>
		<td><img src='file_one.jpg'></td>
		<td><img src='file_two.jpg'></td>
	</tr>
</table>


  	</div><!--/wrap -->
  </div><!--/generator -->



<div id='visualize_output'></div>



<div class="wrap clearfix">
<table width="100%" border="0" cellpadding="25">
  <tr>
    <td style="width:33%; padding: 15px 15px 15px 15px;"><h2>Why use us:</h2>
   
            <img src="images/1-first.gif" alt="Why Us" style="width: 300px;border: 1px solid #ccc;" />
           
            
    </td>
    <td style="width:33%; padding: 15px 15px 15px 15px;"><h2>&nbsp;</h2>
   
            <img src="images/gifthree.gif" style="width: 300px;border: 1px solid #ccc;" alt="Why Us" />
            
         
    </td>
    <td style="width:33%; padding: 15px 15px 15px 15px;"><h2>Go Pro:</h2>
   
            <img src="images/giftwo.gif" style="width: 300px;border: 1px solid #ccc;" alt="Pro" />
            
        
         	
    </td>
  </tr>
  
  
  <tr>
    <td style="width:33%; padding: 15px 15px 15px 15px;">
   
           
            <p>Do you ever feel like the amount of data you need to review is overwhelming? During presentations do you see the eyes of your audience glass over as you go through slide after slide of charts? Well no more.  </p>   
    </td>
    <td style="width:33%; padding: 15px 15px 15px 15px;">
   
            
            <p>Datalyze is a tool to help you visualize any kind of data you want to explore. From simple sales figures to scientific research, we provide you with an easy way to display your data and explain it. Just as film transforms stories, we transform your information into a more exciting and accessible form. Datalyze: you bring the data, we bring the understanding. </p>
         	
    </td>
    <td style="width:33%; padding: 15px 15px 15px 15px;">
   
            
            <p>Do you need more than just simple visualizations? Do you want to help grow your business and predict your success more effectively? Go pro with us and we will give you the tools to guide you into a more profitable future. Through advanced data visualization you will be able to wow clients, predict behavior, track sales and so much more. Don’t let your competition get ahead of you. Stay on top of your industry and increase your revenue stream through effective learning and data interpretation.</p>
         	
    </td>
  </tr>
</table>
</div><!--/wrap -->





<div id="footer">
	<div class="wrap clearfix">
				<ul class="nav">
			  <li><h2>&copy; July 27, 2011 TwoPeat. Don't steal our page.</h2></li>
				</ul>
	</div><!--/wrap -->
</div>

<script type="text/javascript" src="http://code.jquery.com/jquery-1.9.1.js"></script>
<script type="text/javascript" src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
<!--
<script src="http://kaplansurvey.com/javascripts/lib/prototype.js" type="text/javascript"></script>
<script src="http://kaplansurvey.com/javascripts/src/effects.js" type="text/javascript"></script>
<script type="text/javascript" src="js/ajax.js"></script>

<script type="text/javascript">
function ajaxMe() {
	
	var pars = document.getElementById('textfield').value;
	var container = 'visualize_output';

    if (Element.empty(container)) {
       	new Ajax.Updater(container, 'processor.php', {
			parameters: pars,
            onComplete: function() {
				new Effect.BlindDown(container, {duration: 0.25});
			}
	   	});
	} else {
		new Effect[Element.visible(container) ? 
		'BlindUp' : 'BlindDown'](container, {duration: 0.25});
		new Effect[Element.visible(respond) ? 
		'BlindUp' : 'BlindDown'](respond, {duration: 0.25});
       	}
    }

</script>
-->

</body>
</html> 
