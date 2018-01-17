<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<% if (typeof BugLocations != 'undefined') { %>
<td class="file first">
	<%= stringToHTML(BugLocations[0].SourceFile) %>
</td>
<% } %>

<% if (typeof BugLocations != 'undefined') { %>
<td class="line-number">
	<% if (BugLocations[0].StartLine ==  BugLocations[0].EndLine) { %>
	<%= BugLocations[0].StartLine %>
	<% } else if (BugLocations[0].StartLine && BugLocations[0].EndLine) { %>
	<%= BugLocations[0].StartLine %> - <%= BugLocations[0].EndLine %>
	<% } else { %>
	<%= BugLocations[0].StartLine %>
	<% } %>
</td>
<% } %>

<% if (typeof BugLocations != 'undefined') { %>
<td class="column-number">
	<% if (BugLocations[0].StartColumn ==  BugLocations[0].EndColumn) { %>
	<%= BugLocations[0].StartColumn %>
	<% } else if (BugLocations[0].StartColumn && BugLocations[0].EndColumn) { %>
	<%= BugLocations[0].StartColumn %> - <%= BugLocations[0].EndColumn %>
	<% } else { %>
	<%= BugLocations[0].StartColumn %>
	<% } %>
</td>
<% } %>

<% if (typeof BugSeverity != 'undefined') { %>
<td class="group">
	<%= BugSeverity %>
</td>
<% } %>

<% if (typeof BugGroup != 'undefined') { %>
<td class="group">
	<%= stringToHTML(BugGroup) %>
</td>
<% } %>

<% if (typeof BugCode != 'undefined') { %>
<td class="code last">
	<%= stringToHTML(BugCode) %>

	<a class="message" data-toggle="popover" data-original-title="Message" data-html="true" data-placement="top" data-content="<%= unquotateHTML(BugMessage) %>"><i class="fa fa fa-info-circle" style="margin-left:15px;"></i></a>

	<% if (typeof ResolutionSuggestion != 'undefined') { %>
	<a class="suggestion" data-toggle="popover" data-original-title="Suggestion" data-html="true" data-placement="top" data-content="<%= unquotateHTML(ResolutionSuggestion) %>"><i class="fa fa fa-lightbulb-o" style="margin-left:15px;"></i></a>
</td>
	<% } %>
<% } %>
