<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	<h1 id="modal-header-text">
		<i class="fa fa-play"></i>REST Client
	</h1>
</div>

<div class="modal-body">

	<div class="input-group">
		<div class="input-group-addon">
			<select id="method" name="method" class="select required">
				<option value="post"<% if (method && method.toLowerCase() == 'post') { %> selected <% } %>>POST</option>
				<option value="get"<% if (method && method.toLowerCase() == 'get') { %> selected <% } %>>GET</option>
				<option value="put"<% if (method && method.toLowerCase() == 'put') { %> selected <% } %>>PUT</option>
				<option value="delete"<% if (method && method.toLowerCase() == 'delete') { %> selected <% } %>>DELETE</option>
			</select>
			<i class="active fa fa-question-circle" data-toggle="popover" data-placement="right" data-container="body" title="Request method" data-content="This is the type of method to use for the HTTP request."></i>
		</div>
		<input id="route" class="form-control" value="<%= route %>" />
		<div class="input-group-addon">
			<i class="active fa fa-question-circle" data-toggle="popover" data-placement="left" data-container="body" title="Request URL" data-content="This is the location of the server from which to make the HTTP request."></i>
		</div>
	</div>

	<ul class="nav nav-tabs" role="tablist">
		<li role="presentation" id="request-tab" class="active">
			<a href="#request-content" aria-controls="request-content" role="tab" data-toggle="tab"><i class="fa fa-arrow-up"></i>Request</a>
		</li>

		<li role="presentation" id="response-tab">
			<a href="#response-content" aria-controls="response-content" role="tab" data-toggle="tab"><i class="fa fa-arrow-down"></i>Response</a>
		</li>

		<li role="presentation" id="view-command-tab">
			<a href="#command-content" aria-controls="command-content" role="tab" data-toggle="tab"><i class="fa fa-terminal"></i>Command</a>
		</li>
	</ul>

	<div class="tab-content" style="width:100%; height:220px; padding:2px; padding-right:10px; overflow:auto">
		<div role="tabpanel" class="tab-pane active" id="request-content">
			<h2><i class="fa fa-info-circle"></i>Body</h2>
			<div id="request-body" ></div>

			<h2><i class="fa fa-tags"></i>Headers</h2>
			<div id="request-headers"></div>
		</div>

		<div role="tabpanel" class="tab-pane" id="response-content">
			<h2><i class="fa fa-question-circle"></i>Status</h2>
			<div id="response-status">Request has not been submitted yet.</div>

			<h2><i class="fa fa-info-circle"></i>Body</h2>
			<div id="response-json">Request has not been submitted yet.</div>
			<iframe id="response-html" style="width:99%; height:400px; margin-right:20px; overflow:auto; display:none"></iframe>

			<div id="response-html"></div>
			<h2><i class="fa fa-tags"></i>Headers</h2>
			<div id="response-headers">Request has not been submitted yet.</div>
		</div>

		<div role="tabpanel" class="tab-pane" id="command-content">
			<div id="terminal" class="terminal">
				<span class="prompt"></span><span id="command"></span><span class="blinking cursor"></span>
			</div>
		</div>
	</div>

</div>

<div class="modal-footer">
	<button id="submit" class="btn btn-primary"><i class="fa fa-check"></i>Submit</button>
	<button id="cancel" class="btn" data-dismiss="modal"><i class="fa fa-times"></i>Cancel</button> 
</div>