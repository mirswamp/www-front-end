<form action="/" class="form-horizontal" onsubmit="return false;">
	<div id="package-type-form"></div>

	<div align="right">
		<label><span class="required"></span>Fields are required</label>
	</div>

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
				<div id="package-dependencies-form"></div>
			</div>
		</div>
	</div>
</form>