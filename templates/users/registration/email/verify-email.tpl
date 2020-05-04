<h1>Verify Email Address</h1>

<p>Dear <%- user.getFullName() %>:</p>
<% if (!verify_date) { %>
<p>You have registered to join the SWAMP. To complete your registration, press the button below.  Once you have done this, you may log in and begin using the SWAMP.
</p>
<% } else { %>
This email verification link has already been used and is no longer valid.
<% } %>

<div class="bottom buttons">
	<button id="verify" class="btn btn-primary btn-lg"<% if (verify_date) { %> disabled<% } %>><i class="fa fa-plus"></i>Verify</button>
</div>