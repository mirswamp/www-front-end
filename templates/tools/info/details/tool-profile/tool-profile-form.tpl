<form action="/" class="form-horizontal">

	<div class="form-group">
		<label class="required control-label">Name</label>
		<div class="controls">
			<div class="input-group">
				<input type="text" class="required form-control" name="name" id="name" maxlength="100" value="<%- name %>">
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Name" data-content="The name of your software tool, excluding the version." value="<%- name %>"></i>
				</div>
			</div>
		</div>
	</div>

	<div class="form-group" style="display:none">
		<label class="required control-label">Is build needed</label>
		<input id="is-build-needed" type="checkbox" data-toggle="popover" data-placement="right" title="Is build needed" data-content="The flag determines whether this tool operates upon the output of a build (such as Java bytecode) or source code."
		<% if (is_build_needed) { %>
			checked
		<% } %>
		/>
	</div>

	<div align="right">
		<label><span class="required"></span>Fields are required</label>
	</div>
</form>
