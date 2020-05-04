<h1><div class="icon"><i class="fa fa-pencil"></i></div>Sign Up</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-pencil"></i>Sign Up</li>
</ol>

<h2><i class="fa fa-file-text"></i>Acceptable Use Policy</h2>
<%= policy %>

<h2><i class="fa fa-handshake-o"></i>Statement of Agreement</h2>
<p>By clicking 'I Accept' it serves as acknowledgement that you have read and understand the Terms and Conditions.</p>

<div class="alert alert-warning" style="display:none">
	<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
	<label>Error: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
</div>

<form action="/">
	<div class="well">
		<label>
			<input type="checkbox" name="accept" id="accept" class="required" >
			I accept
		</label>
	</div>
</form>

<div class="buttons">
	<button id="next" class="btn btn-primary btn-lg"><i class="fa fa-arrow-right"></i>Register</button>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>