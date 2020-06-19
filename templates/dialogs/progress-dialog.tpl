<div class="modal-header">
	<div class="modal-title">
		<h1><%= title || "Progress" %></h1>
	</div>
</div>

<div class="modal-body" style="padding:10px">
	<div class="message" style="height:1em; text-align:center"><%= message%></div>
	<div style="float:left; margin-top:5px; margin-right:10px;">	
		<div class="amount" style="display:inline-block"><%= amount %></div>
	</div>
	
	<div class="progress" style="margin-top:5px">
		<div class="bar" style="width:0"></div>
	</div>

	<% if (cancelable) { %>
	<div style="text-align:right">
		<button class="cancel btn" data-dismiss="modal"><i class="fa fa-close"></i>Cancel</button> 
	</div>
	<% } %>
</div>