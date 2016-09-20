<h1>Confirm Project Membership</h1>

<p>You, <%- invitee_name %>, have been sent an invitation to the project '<%- project.get('full_name') %>' by <%- sender.getFullName() %>.
</p>
<p>You may accept or decline this invitation.</p>

<div class="bottom buttons">
	<button id="accept" class="btn btn-primary btn-lg"><i class="fa fa-plus"></i>Accept</button>
	<button id="decline" class="btn btn-lg"><i class="fa fa-times"></i>Decline</button>
</div>