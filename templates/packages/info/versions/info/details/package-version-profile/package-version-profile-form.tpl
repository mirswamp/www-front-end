<form action="/" class="form-horizontal" onsubmit="return false;">

	<div class="form-group" id="checkout-argument"<% if (!package.has('external_url') || package.hasValidArchiveUrl()) { %> style="display:none"<% } %>>
		<label class="control-label">Checkout argument</label>
		<div class="controls">
			<div class="input-group">
				<input type="text" class="form-control" value="<%= checkout_argument %>">
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="left" data-container="body" title="Checkout argument" data-html="true" data-content="<p>This is a string passed to the checkout command to fetch a particular branch, tag, or version of the code repository. The checkout command is run after the repository is cloned from the External URL.</p><b><i>Git command: </b></i><br/><pre>git checkout [argument]</pre>"></i>
				</div>
			</div>
		</div>
	</div>

	<div class="form-group">
		<label class="required control-label">Version</label>
		<div class="controls">
			<div class="input-group">
				<input type="text" class="required form-control" id="version-string" name="version-string"  maxlength="100" value="<%- version_string %>" />
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Version" data-content="An optional string, number, or code that uniquely identifies this particular version of the software."></i>
				</div>
			</div>
		</div>
	</div>

	<div class="form-group">
		<label class="control-label">Version notes</label>
		<div class="controls">
			<div class="input-group">
				<textarea class="form-control" id="notes" name="notes" rows="3" maxlength="1000"><%- notes %></textarea>
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Description" data-content="Please include any version specific notes here."></i>
				</div>
			</div>
		</div>
	</div>

	<div align="right">
		<label><span class="required"></span>Fields are required</label>
	</div>
</form>
