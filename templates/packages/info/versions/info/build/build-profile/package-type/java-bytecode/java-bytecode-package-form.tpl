<form action="/" class="form-horizontal" onsubmit="return false;">
	<fieldset>
		<legend>Java bytecode info</legend>

		<div class="form-group">
			<label class="required control-label">Class path</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" id="class-path" rows="3" class="required"><%- (bytecode_class_path? bytecode_class_path : '.')%></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Class path" data-content="A ‘:’ separated list of paths to Java archive files (jar, zip, war, ear files), class files or directories containing class files that are to be assessed. For a directory, all the class files in the directory tree are assessed. Additionally, a directory path can end with a wildcard character ‘*’, in that case all the jar files in the directory are assessed. These paths are relative to the package path."></i>
					</div>
				</div>
			</div>
			<div class="buttons">
				<button id="add-class-path" class="btn"><i class="fa fa-list"></i>Add</button>
			</div>
		</div>

		<div class="form-group">
			<% var showAdvanced = bytecode_aux_class_path || bytecode_source_path; %>

			<div id="advanced-settings" class="panel">
				<div class="panel-group">

					<div class="panel-heading">
						<label>Advanced settings</label>
					</div>

					<div class="nested">
						<div id="path-settings" class="well">
							<h3><i class="fa fa-road"></i>Path settings</h3>

							<div class="form-group">
								<label class="control-label">Aux class path</label>
								<div class="controls">
									<div class="input-group">
										<textarea class="form-control" id="aux-class-path" rows="3"><%- bytecode_aux_class_path %></textarea>
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Aux class path" data-content="A ‘:’ separated list of paths to Java archive files (jar, zip, war, ear files), class files or directories containing class files that are referenced by the bytecode in the package-classpath. These files are not assessed by a swa-tool. For a directory, all the class files in the directory tree are included. Additionally, a directory path can end with a wildcard character ‘*’, in that case all the jar files in the directory are included. These paths are relative to the package path."></i>
										</div>
									</div>
								</div>
								<div class="buttons">
									<button id="add-aux-class-path" class="btn"><i class="fa fa-list"></i>Add</button>
								</div>
							</div>

							<div class="form-group">
								<label class="control-label">Source path</label>
								<div class="controls">
									<div class="input-group">
										<textarea class="form-control" id="source-path" rows="3"><%- bytecode_source_path %></textarea>
										<div class="input-group-addon">
											<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Source path" data-content="A ‘:’ separated list of paths to directories containing source files for the bytecode in the classpath. For the source information to be present in the assessment reports, the bytecode in package-classpath must be compiled with debugging information (see javac -g option). These paths are relative to the package path."></i>
										</div>
									</div>
								</div>
								<div class="buttons">
									<button id="add-source-path" class="btn"><i class="fa fa-list"></i>Add</button>
								</div>
							</div>

						</div>
					</div>
				</div>
			</div>
		</div>
	</fieldset>
</form>