<%
function numberWithCommas(number) {
	if (number) {
		return number.toLocaleString();
	}
}
%>

<label class="fineprint" style="float:left">Usage over the past year</label>
<table>
	<thead>
		<tr>
			<th>
				<i class="fa fa-upload"></i>
				<span>Package uploads</span>
			</th>
			<th>
				<i class="fa fa-check"></i>
				<span>Assessments</span>
			</th>
			<th>
				<i class="fa fa-list"></i>
				<span>Lines of code</span>
			</th>
		</tr>
	</thead>

	<tbody>
		<tr>
			<td>
				<span><%= numberWithCommas(data.package_uploads) %></span>
			</th>
			<td>
				<span><%= numberWithCommas(data.assessments) %></span>
			</td>
			<td>
				<span><%= numberWithCommas(data.loc) %></span>
			</td>
		</tr>		
	</tbody>
</table>
