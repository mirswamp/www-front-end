<h1><div class="icon"><i class="fa fa-pencil"></i></div>Sign Up With</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a><i class="fa fa-pencil"></i>Sign Up With</a></li>
</ol>

<h2><i class="fa fa-file-text"></i>Acceptable Use Policy</h2>
<%= acceptable_use_policy %>

<h2><i class="fa fa-file-text"></i>Linked Account Policy</h2>
<%= linked_account_policy %>

<h2><i class="fa fa-handshake-o"></i>Statement of Agreement</h2>
<p>If you accept this responsibility, click the "Sign Up with" button to create a new account using your credentials from the identity provider that you have selected. </p>

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
	<button id="next" class="btn btn-lg btn-primary"><i class="fa fa-arrow-right"></i>Sign Up with <%= provider.toTitleCase() %></button>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>