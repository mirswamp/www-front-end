<form action="/" class="form-horizontal">
	<div class="form-group">
		<label class="required control-label">Name</label>
		<div class="controls">
			<div class="input-group">
				<input type="text" class="required form-control" name="name" id="name" maxlength="100" value="<%- full_name %>">
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Name" data-content="The project name is a way for you to identify your project."></i>
				</div>
			</div>
		</div>
	</div>

	<div class="form-group">
		<label class="control-label">Description</label>
		<div class="controls">
			<div class="input-group">
				<textarea rows="6" class="form-control" name="description" maxlength="500" id="description"><%- description %></textarea>
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Description" data-content="Please include a short description of your project."></i>
				</div>
			</div>
		</div>
	</div>

	<div class="tool-owner-options form-group" style="display:none">
		<label class="control-label">Use public tools</label>
		<div class="controls">
			<input type="checkbox" id="use-public-tools" <% if (!exclude_public_tools_flag) { %>checked<% } %>>
		</div>
	</div>

	<div align="right">
		<label><span class="required"></span>Fields are required</label>
	</div>
</form>
