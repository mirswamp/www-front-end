<% if (policy) { %>

<h2>Policy</h2>
<p>Please review and accept the following policy statement and provide a comment explaining why you require this permission.</p>

<div class="well vertically scrollable" style="max-height:350px">
<%= policy %>
</div>
<br />

<div id="policy-form">
	<form class="form-horizontal">
		<div class="checkbox well">
			<label class="required">
				<input type="checkbox" no-focus name="accept_policy" class="required">
				I accept
			</label>
		</div>
	</form>
</div>
<br />
<% } else { %>
<p>Please comment on this request.</p>
<% } %>

<div id="comment-form">
	<form class="form-horizontal">

		<% if (changeUserPermissions) { %>
		<div class="form-group">
			<label class="control-label">User Justification</label>
			<div class="controls">
				<p class="form-control-static">
					<% if (typeof user_comment != 'undefined') { %>
					<%- user_comment %>
					<% } else { %>
					<b>none</b>
					<% } %>
				</p>
			</div>
		</div>
		<% } %>

		<% if (typeof meta_information != 'undefined') { %>
		<div class="form-group">
			<label class="control-label">User Data</label>
			<div class="controls">
				<div id="user-data"></div>
			</div>
		</div>
		<% } %>

		<div class="form-group">
			<label class="control-label">Comment</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" id="comment" name="comment" rows="3" maxlength="8000"></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Description" data-content="Please type your comment here."></i>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>
