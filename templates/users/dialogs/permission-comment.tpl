<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	<h1 id="modal-header-text">
		<i class="fa fa-comment"></i>
		<% if (title) { %>
		<%- title %>
		<% } else { %>
		Confirm
		<% } %>
	</h1>
</div>

<div class="modal-body">
	<div class="content" style="width:100%; height:400px; overflow:auto">
		<% if (message) { %>
		<p><%- message %></p>
		<% } %>
		
		<div id="tool-form"></div>

		<% if (!changeUserPermissions) { %>

		<% if (policy) { %>
		<h3>Policy</h3>

		<div class="well vertically scrollable" style="height:350px">
		<%= policy %>
		</div>
		<% } %>

		<% } else { %>
		<label style="width: auto;">User Justification</label><br/>
		<p><%- user_comment %></p>
		<%
			var output = '';
			if( meta_information && meta_information.length > 2 ){
				var output = '';
				meta_information = JSON.parse( meta_information );
				if( typeof meta_information === 'object' ){
					output += '<label style="width: auto;">Meta Information</label><br/><p>'
					for( var prop in meta_information ){
						output += '<b>' + prop + ':</b> ' + meta_information[prop] + '<br/><br/>';
					}
					output += '</p>';
				}
			}
		%>

		<% if (output != '') { %>
		<div class="well vertically scrollable" style="height:350px">
		<%= output %>
		</div>
		<% } %>
		<% } %>

		<div class="alert alert-warning" style="display:none">
			<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
			<label>Error: </label><span class="message">You must first read the policy and check the "I accept" box below to proceed.</span>
		</div>
		
		<div id="policy-form">
			<form class="form-horizontal">
				<% if (!changeUserPermissions) { %>
				<div class="checkbox well">
					<label class="required">
						<input type="checkbox" no-focus name="accept_policy" class="required">
						I accept
					</label>
				</div>
				<% } %>
			</form>
		</div>
		<br />

		<div id="comment-form">
			<form class="form-horizontal">
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

		<div align="right">
			<label><span class="required"></span>Fields are required</label>
		</div>
	</div>
</div>

<div class="modal-footer">
	<button id="ok" class="btn btn-primary" data-dismiss="modal"><i class="fa fa-check"></i>
		<% if (ok) { %><%- ok %><% } else { %>OK<% } %>
	</button>
	<button id="cancel" class="btn" data-dismiss="modal"><i class="fa fa-times"></i>
		<% if (cancel) { %><%- cancel %><% } else { %>Cancel<% } %>
	</button>
</div>
