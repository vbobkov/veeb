<!DOCTYPE HTML>
<html>
<head>
	<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
	<?php echo $header_includes; ?>
</head>
<body>
	<div id="header">
		<div class="t3h-logo">
			<div class="logo1">VeeB's corner</div>
			<div class="logo2">//web dev shenanigans</div>
			<div class="black-magic" disabled>
<pre>
/* I am 0x5F3759DF.  I am Black Magic. */
float Q_rsqrt( float number )
{
</pre>
<pre>
	long i;
	float x2, y;
	const float threehalfs = 1.5F;
</pre>
<pre>
	x2 = number * 0.5F;
	y  = number;
	i  = * ( long * ) &y;                       // evil floating point bit level hacking
</pre>
<pre>
	i  = 0x5f3759df - ( i >> 1 );               // what the fuck?
	y  = * ( float * ) &i;
	y  = y * ( threehalfs - ( x2 * y * y ) );   // 1st iteration
</pre>
<pre>
//	y  = y * ( threehalfs - ( x2 * y * y ) );   // 2nd iteration, this can be removed
	return y;
}
</pre>
<pre>a website without any images</pre>
				<div class="l33t-stripes">
					<div class="stripe1"></div>
					<div class="stripe2"></div>
					<div class="stripe3"></div>
					<div class="stripe4"></div>
					<div class="stripe5"></div>
					<div class="stripe6"></div>
					<!--
					<div class="stripe7"></div>
					<div class="stripe8"></div>
					<div class="stripe9"></div>
					<div class="stripe10"></div>
					-->
				</div>
			</div>
		</div>
		<?php echo $menu; ?>
	</div>
	<div id="container">