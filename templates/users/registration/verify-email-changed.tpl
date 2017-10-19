<h1>Verify Email Address</h1>

<p>Dear <%- user.getFullName() %>:</p>
<% if (!verify_date) { %>
<p>You have recently attempted to change your SWAMP email address. To change your email address to the account containing this confirmation url, press the button below.
</p>
<% } else { %>
This email change verification link has already been used and is no longer valid.
<% } %>

<div class="bottom buttons">
	<button id="verify" class="btn btn-primary btn-lg"<% if (verify_date) { %> disabled<% } %>><i class="fa fa-plus"></i>Verify</button>
</div>
