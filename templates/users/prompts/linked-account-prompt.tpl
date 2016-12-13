<h1>Linked Account Use Policy</h1>
<p>When you link your SWAMP account to an external identity provider, you are asking SWAMP to rely on the security of that provider.  You are responsible for protecting your linked account with a <a style="cursor: pointer" data-toggle="popover" data-placement="right" title="SWAMP Password Policy" data-content="<%= passwordPolicy %>">strong password</a>. SWAMP also recommends enabling two factor authentication with the linked identity provider account, if possible.</p>

<h2>Statement of Agreement</h2>
<p>If you accept this responsibility, click "I accept" then click "Sign Up!" to create and link a new SWAMP acccount with an identity provider, or "Link Existing" if you already have a SWAMP account and you'd like to link it to your identity provider account. If you have questions, please contact the Help Desk at <code><a href="mailto:support@continuousassurance.org">support@continuousassurance.org</a></code>.</p>

<div class="alert alert-warning" style="display:none">
	<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
	<label>Warning: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
</div>

<form action="/" id="accept-form">
	<div class="well">
		<label class="required">
			I accept
			<input type="checkbox" name="accept" id="accept" class="required" />
		</label>
	</div>
</form>

<p>
If you are <b>new to the SWAMP</b>, please click Sign Up to complete your registration. If you are an <b>existing SWAMP user</b>, please click Link Existing to link your identity provider account to your SWAMP account so you can sign in using this provider in the future.
</p>

<div class="bottom buttons">
	<button id="register-new" class="btn btn-lg btn-primary"><i class="fa fa-pencil"></i>Sign Up</button> 
	<button id="link-existing" class="btn btn-lg"><i class="fa fa-link"></i>Link Existing</button>
</div>