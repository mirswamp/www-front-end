<form action="/" class="form-horizontal">
	<div class="form-group">
		<label class="required control-label">Name</label>
		<div class="controls">
			<div class="input-group">
				<input type="text" class="required form-control" name="name" id="name" value="<%- name %>">
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Name" data-content="The name is what this schedule is called (for example, Daily, Weekly, etc.)"></i>
				</div>
			</div>
		</div>
	</div>

	<div class="form-group">
		<label class="required control-label">Description</label>
		<div class="controls">
			<div class="input-group">
				<textarea class="required form-control" name="description" id="description"><%- description %></textarea>
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Description" data-content="Please include a short description of this schedule."></i>
				</div>
			</div>
		</div>
	</div>

	<div align="right">
		<label><span class="required"></span>Fields are required</label>
	</div>
</form>
