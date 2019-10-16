<form action="/" class="form-horizontal" onsubmit="return false;">
	<div id="package-form"></div>

	<div class="panel" id="package-dependencies-accordion">
		<div class="panel-group">
			<div class="panel-heading">
				<label>
				<a class="accordion-toggle" data-toggle="collapse" data-parent="#package-dependencies-accordion" href="#package-dependencies-info">
					<i class="fa fa-minus-circle" />
					Package dependencies
				</a>
				</label>
			</div>
			<div id="package-dependencies-info" class="nested accordion-body collapse in">
				<div id="package-dependencies-list"></div>

				<div class="middle buttons">
					<button id="add-new-dependency" class="btn"><i class="fa fa-plus"></i>Add New Dependency</button>
				</div>
			</div>
		</div>
	</div>
</form>