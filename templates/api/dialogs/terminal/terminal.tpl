<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	<h1 id="modal-header-text">
		<i class="fa fa-terminal"></i>Terminal
	</h1>
</div>

<div class="modal-body">
	<p>Execute the command below in a terminal or command window.</p>
	<div class="code terminal">
		<span class="prompt"></span><%= command.replace(/\//g, '<wbr>/<wbr>') %><span class="blinking cursor"></span>
	</div>
</div>

<div class="modal-footer">
	<button id="ok" class="btn" data-dismiss="modal"><i class="fa fa-check"></i>OK</button> 
</div>