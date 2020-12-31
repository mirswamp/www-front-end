<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	<h1 id="modal-header-text">
		<i class="fa fa-plus"></i>
		Add New Class
	</h1>
</div>

<div class="modal-body">
	<p>Please select a class to join from the list below:</p>
	<div style="text-align:center">
		<select id="class-code">
			<option value="blank"></option>
			<% for (var i = 0; i < collection.length; i++) { %>
			<option value="<%= collection.at(i).get('class_code') %>" index="<%= i %>"><%= collection.at(i).get('class_code') %></option>
			<% } %>
		</select>
	</div>

	<br />
	<div class="alert alert-info" style="display:none">
		<label>Note: </label><span class="message">By enrolling in this class, you agree to sharing your activity and account information in the application with your instructor. At the end of the class, you may unenroll yourself from the class through your account profile. Access your account profile by clicking on your username.</span>
	</div>
</div>

<div class="modal-footer">
	<button id="ok" class="btn btn-primary" data-dismiss="modal" disabled><i class="fa fa-check"></i>OK</button>
	<button id="cancel" class="btn" data-dismiss="modal"><i class="fa fa-times"></i>Cancel</button> 
</div>