<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	<h1 id="modal-header-text">
		<i class="fa fa-check"></i>
		<% if (title) { %>
		<%- title %>
		<% } else { %>
		Accept Policy
		<% } %>
	</h1>
</div>

<div class="modal-body">
	<i class="alert-icon fa fa-3x fa-info-circle" style="float:left; margin-left:10px; margin-right:20px"></i>
	<p><%- message %></p>

	<div class="well vertically scrollable" style="max-height:200px">
	<%= policy %>
	</div>

	<form action="/" id="aup-form">
		<div class="checkbox well">
			<label class="required">
				<input type="checkbox" name="accept" id="accept" class="required" >
				I accept
			</label>
		</div>
	</form>
</div>

<div class="modal-footer">
	<button id="ok" class="btn btn-primary" data-dismiss="modal" disabled><i class="fa fa-check"></i>OK</button>
	<button id="cancel" class="btn" data-dismiss="modal"><i class="fa fa-times"></i>Cancel</button> 
</div>
