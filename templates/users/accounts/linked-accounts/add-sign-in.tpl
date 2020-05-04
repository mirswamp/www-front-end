<h1><i class="fa fa-link"></i>Add Sign In</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#my-account"><i class="fa fa-user"></i>My Account</a></li>
	<li><i class="fa fa-link"></i>Add Sign In</li>
</ol>

<h2>Terms and Conditions</h2>
<%= linked_account_policy %>

<h2>Statement of Agreement</h2>
<p>If you accept this responsibility, click "I accept" then click the "Add Sign In" button to link your account with your identity provider. </p>

<div class="alert alert-warning" style="display:none">
	<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
	<label>Warning: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
</div>

<form action="/">
	<div class="well">
		<label>
			<input type="checkbox" name="accept" id="accept" class="required" >
			I accept
		</label>
	</div>
</form>

<div class="bottom buttons">
	<button id="add-sign-in" class="btn btn-lg btn-primary"><i class="fa fa-link"></i>Add Sign In with <%= provider %></button>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>