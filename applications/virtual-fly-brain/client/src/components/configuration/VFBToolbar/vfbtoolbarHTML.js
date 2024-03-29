/* eslint-disable no-tabs */
var feedback
  = "<div id='vfb-content-block' class='callout vfbcontent'> "
  + "<div id='vfb-content-titlebar'> "
  + "	<div id='vfb-content-title'>Give us feedback!</div> "
  + "</div>"
  + "<div id='vfb-content-text' class='vfbcontent'>"
  + "<h2>Help us improve the site</h2>"
  + "<p>We really appreciate any feedback you could give us.</p>"
  + "<p>You can simply <b><span id='emailUs'></span></b>email us (support@virtualflybrain.org) with details.</p>"
  + "<p>Alternatively, as VFB is an opensource project, "
  + "you can engage directly with our developer community on GitHub "
  + "[<a href='https://github.com/VirtualFlyBrain/VFB2' target='_blank'>VirtualFlyBrain/VFB2</a>].</p>"
  + "<p>If you have a GitHub account you can easily raise a new issue: "
  + "<form id='GitHubIssue' method='get' action='https://github.com/VirtualFlyBrain/VFB2/issues/new' target='_blank'>"
  + "<input type='hidden' name='body' value='Please give details of the issue:\n\n\n\n\nSupport info:\n$DATE$\n$BROWSER$\n$VERSION$ [$SCREEN$]\n$URL$\n\n\ndiff\n$LOG$\n\n' />"
  + "<input type='submit' value='Create GitHub Issue' style='color: black; border-color: darkcyan;'></form>"
  + "</p>"
  + "<p> This could simply be a question or a new feature request, but if you have found a bug we missed please copy in "
  + "the page address and system details listed below to help us resolve any issue as quickly as possible."
  + "</p>"
  + "<div style='border: 1px solid green;''>"
  + "<b>Referring page:</b> <small id='feedback_url'>$URL$</small><br />"
  + "<b>System details:</b> <small id='feedback_systemDetails'>$BROWSER$ $VERSION$ [$SCREEN$] $DATE$</small><br />"
  + "<details>"
  + "<summary><b>Full Console Log</b> <small>(if requested)</small></summary>"
  + "<p style='padding-left:30px;padding-right:30px;font-size:75%;'>$COLOURLOG$</p>"
  + "</details>"
  + "</div>"
  + "<p>Thank you for your help.</p>"
  + "</div>"
  + "</div>";


var about
  = "		    <div id='vfb-content-block' class='callout vfbcontent'> "
  + "           <div id='vfb-content-titlebar'> "
  + "          		<div id='vfb-content-title'>About <span style='color:white;'> Virtual Fly Brain</span></div> "
  + "			</div>		"
  + "			<div id='vfb-content-text' class='vfbcontent'><div>"
  + "				<h2>Who we are</h2>"
  + "				<p>Virtual Fly Brain members and their contribution: </p>"
  + "			</div>"
  + "			<div class='vfb-content-container col-xs-12'>"
  + "				<div class='row'>"
  + "					<div class='small-3 columns text-center content-image'>"
  + "						<a href='http://www.anc.ed.ac.uk/index.php?option=com_content&task=view&id=12&Itemid=68' target='_blank'>"
  + "							<img class='' src='https://v2.virtualflybrain.org/images/vfb/project/logos/InformaticsLogo.gif' />"
  + "						</a>"
  + "					</div>"
  + "					<div class='small-9 columns'>"
  + "						<i>3D Viewer, online tools, server and the website:</i><br />"
  + "						<b>Institute for Adaptive and Neural Computation, School of Informatics, University of Edinburgh</b><br />"
  + "						<a href='https://www.inf.ed.ac.uk/people/staff/Robert_Court.html' target='_blank'>Robert Court (Lead DevOps)</a> <br />"
  + "						<a href='https://www.inf.ed.ac.uk/people/staff/James_Armstrong.html' target='_blank'>Douglas Armstrong"
  + "					(current project PI)</a><br />"
  + "						Former devs: Nestor Milyaev (2009-2012)<br />"
  + "					</div>"
  + "				</div>"
  + "				<div class='row'>"
  + "					<div class='small-3 columns text-center content-image'>"
  + "						<a href='http://www.gen.cam.ac.uk/' target='_blank'>"
  + "							<img class='' src='https://v2.virtualflybrain.org/images/vfb/project/logos/CUnibig.png'"
  + "							/>"
  + "						</a>"
  + "					</div>"
  + "					<div class='small-9 columns'>"
  + "						<i>Ontology editing, FlyBase support and data annotation:</i><br />"
  + "						<b>Department of Genetics, University of Cambridge</b><br />"
  + "						<a href='http://www.neuroscience.cam.ac.uk/directory/profile.php?cokane' target='_blank'>Cahir O'Kane (current project PI)</a><br />"
  + "						Former contributors: Michael Ashburner (original PI and grant holder), Simon Reeve (2009-2011), Nicole Staudt (2015-2016), Alex Holmes (2017-2019)<br />"
  + "						<b>Department of Physiology, Development and Neuroscience</b><br />"
  + "						<a href='https://www.pdn.cam.ac.uk/research/groups/flybase/flybase-group-members' target='_blank'>Clare Pilgrim</a> (Ontology editor/Curator)<br />"
  + "						<a href='https://www.pdn.cam.ac.uk/research/groups/flybase/flybase-group-members' target='_blank'>Alex McLachlan</a> (Curator/UX Tester)<br />"
  + "						<a href='https://www.pdn.cam.ac.uk/research/groups/flybase/flybase-group-members' target='_blank'>Aoife Larkin</a> (Curator)<br />"
  + "						<a href='https://www.pdn.cam.ac.uk/research/groups/flybase/flybase-group-members' target='_blank'>Gillian Millburn</a> (Senior Curator)<br />"
  + "						<a href='https://www.pdn.cam.ac.uk/research/groups/flybase/flybase-group-members' target='_blank'>Nick Brown (current project PI)</a><br />"
  + "						<b>Department of Zoology, University of Cambridge</b><br />"
  + "						<a href='http://www.neuroscience.cam.ac.uk/directory/profile.php?mcosta' target='_blank'>Marta Costa (current project Co-I)</a><br />"
  + "					</div>"
  + "				</div>"
  + "				<div class='row'>"
  + "					<div class='small-3 columns text-center content-image'>"
  + "						<a href='http://www2.mrc-lmb.cam.ac.uk/' target='_blank'>"
  + "							<img class='' src='https://v2.virtualflybrain.org/images/vfb/project/logos/MRC-LMB_logo.png' border='0' />"
  + "						</a>"
  + "					</div>"
  + "					<div class='small-9 columns'>"
  + "						<i>Image processing, registration and NBLAST neuron search:</i><br />"
  + "						<b>MRC Laboratory of Molecular Biology, Cambridge</b><br />"
  + "						<a href='http://www2.mrc-lmb.cam.ac.uk/group-leaders/h-to-m/gregory-jefferis/' target='_blank'>Greg Jefferis"
  + "					(current project PI)</a><br />"
  + "					</div>"
  + "				</div>"
  + "				<div class='row'>"
  + "					<div class='small-3 columns text-center content-image'>"
  + "						<a href='http://www.ebi.ac.uk/' target='_blank'>"
  + "							<img class='' src='https://v2.virtualflybrain.org/images/vfb/project/logos/EMBL_EBI_logo_180pixels_RGB.png'"
  + "								border='0' />"
  + "						</a>"
  + "					</div>"
  + "					<div class='small-9 columns'>"
  + "						<i>Schema development &amp; Web development:</i><br />"
  + "						<b>European Bioinformatics Institute (EMBL-EBI), Cambridge</b><br />"
  + "						<a href='https://www.ebi.ac.uk/about/people/david-osumi-sutherland' target='_blank'>David Osumi-Sutherland"
  + "					(current project Co-I)</a><br />"
  + "						<a href='https://www.researchgate.net/profile/Nicolas_Matentzoglu2' target='_blank'>Nico Matentzoglu"
  + "					(developer)</a><br />"
  + "						<a href='https://www.ebi.ac.uk/about/people/helen-parkinson' target='_blank'>Helen Parkinson (current"
  + "					project PI)</a><br />"
  + "					</div>"
  + "				</div>"
  + "				<div class='row' style='margin-bottom: 0px !important;''>"
  + "					<div class='small-3 columns text-center content-image'>"
  + "						<a href='http://www.metacell.us/' target='_blank'>"
  + "							<img class='' src='https://github.com/tarelli/bucket/raw/master/MetaCellLogoWhite300ppi.png'"
  + "								border='0' />"
  + "						</a>"
  + "					</div>"
  + "					<div class='small-9 columns'>"
  + "						<i>Software engineering, <a href='http://www.geppetto.org' target='_blank'>Geppetto</a> customisation, graphics design:</i><br />"
  + "						<b><a href='http://www.metacell.us' target='_blank'>MetaCell</a> Ltd., LLC, Oxford, UK - Boston, MA</b><br />"
  + "					</div>"
  + "				</div>"
  + "			</div>"
  + "			<div >"
  + "				<br />"
  + "				<h2>Funding</h2>"
  + "				<div class=''>"
  + "					<div class='small-3 columns text-center content-image'>"
  + "						<a href='http://www.ebi.ac.uk/' target='_blank'>"
  + "							<img class='' src='https://v2.virtualflybrain.org/images/vfb/project/logos/wtvm050446.png' border='0'"
  + "							/>"
  + "						</a>"
  + "					</div>"
  + "					<div class='small-9 columns'>"
  + "						Virtual Fly Brain is supported by a grant from the <a href='http://www.wellcome.ac.uk/'"
  + "							target='_blank'>Wellcome Trust</a>: <a href='https://wellcome.ac.uk/funding/biomedical-resource-and-technology-development-grants'"
  + "								target='_blank'>Virtual Fly Brain (Grant ref: 208379/Z/17/Z) (October 2017 to September 2021)</a> following <a"
  + "									href='https://wellcome.ac.uk/funding/biomedical-resource-and-technology-development-grants' target='_blank'"
  + "								>Virtual Fly Brain: a global informatics hub for Drosophila neurobiology (WT105023MA) (October 2014 to September 2017)</a>."
  + "			</div>"
  + "				</div>"
  + "				<p> This work was previously supported by a research award from the <a href='http://www.bbsrc.ac.uk/'"
  + "					target='_blank'>BBSRC</a> to Douglas"
  + "Armstrong and Michael Ashburner."
  + "			Details of this grant at <a"
  + "						href='http://www.bbsrc.ac.uk/pa/grants/AwardDetails.aspx?FundingReference=BB/G02233X/1' target='_blank'>Cambridge</a>"
  + "					and"
  + "			<a href='http://www.bbsrc.ac.uk/pa/grants/AwardDetails.aspx?FundingReference=BB/G02247X/1' target='_blank'>Edinburgh</a>."
  + "			A UK <a href='http://www.rcuk.ac.uk/research/xrcprogrammes/prevprogs/' target='_blank'>e-Science Theme award</a>"
  + "					to Douglas Armstrong helped us establish the project."
  + "		</p>"
  + "				<p>"
  + "					Marta Costa was also supported by a <a href='http://www.newtontrust.cam.ac.uk/' target='_blank'>Isaac Newton"
  + "			Trust</a> grant (October 2012 to September 2013)."
  + "		</p>"
  + "			</div>"
  + "			<div >"
  + "				<h2>Collaborators</h2>"
  + "			</div>"
  + "			<div class='col-xs-12'>"
  + "				<div class='row'>"
  + "					<div class='small-3 columns text-center content-image'>"
  + "						<a href='http://www.hgu.mrc.ac.uk/' target='_blank'>"
  + "							<img class='' src='https://v2.virtualflybrain.org/images/vfb/project/logos/mrchguLogo.png' border='0' /></a>"
  + "					</div>"
  + "					<div class='small-9 columns'>"
  + "						<i>The IIP3D server, Woolz software and client-side tools* are developed by:</i><br />"
  + "						MRC Human Genetics Unit (MRC HGU): Richard Baldock, Nick Burton, Bill Hill, Zsolt Husz<br />"
  + "						<i>(*) An on-going development of the client-side tools is done in collaboration between the MRC HGU and"
  + "					Edinburgh University</i> <br />"
  + "						Visit the <a href='http://www.emouseatlas.org/emage/' target='_blank'>EMAGE gene expression database</a> to"
  + "				see other tools the MRC HGU have developed.<br />"
  + "						<br clear='all' />"
  + "					</div>"
  + "				</div>"
  + "				<div class='row'>"
  + "					<div class='small-3 columns text-center content-image'>"
  + "						<a href='http://www.flybase.org/' target='_blank'>"
  + "							<img class='' src='https://v2.virtualflybrain.org/images/vfb/project/logos/flybase.gif' border='0' /></a>"
  + "					</div>"
  + "					<div class='small-9 columns'>"
  + "						<i>Expression data</i> is collaboratively curated by VFB and <a href='http://www.flybase.org/'"
  + "							target='_blank'>FlyBase</a>. <i>Phenotype"
  + "				data</i> is curated by FlyBase. Expression and phenotype data displayed on VFB is stored and maintained by"
  + "						FlyBase."
  + "			</div>"
  + "				</div>"
  + "			</div>"
  + "			<div >"
  + "				<h2>Acknowledgements</h2>"
  + "				<p> We would like to thank Arnim Jenett of HHMI Janelia Research Campus, and Kei Ito and Kazunori Shinomiya of Tokyo"
  + "					University for the painted adult brain stack that we use on the 3D Brain Viewer."
  + "		</p>"
  + "				<p>We thank the group of A.S. Chiang (Brain Research Center, National Tsing Hua University, Taiwan) for making their"
  + "					FlyCircuit raw data available. We also thank Kei Ito (Tokyo University) and Tzumin Lee (HHMI Janelia Research"
  + "					Campus) for providing us with their neuroblast clone data."
  + "		</p>"
  + "				<p> We also thank the following researchers for their hard work in reviewing elements of VFB content:"
  + "		</p>"
  + "				<ul>"
  + "					<li>"
  + "						Liria Masuda Nakagawa (Department of Genetics, University of Cambridge, Cambridge) for review of the larval"
  + "						olfactory system;"
  + "			</li>"
  + "					<li>"
  + "						Orie Shafer (Molecular, Cellular and Developmental Biology, University of Michigan) for reviewing VFB"
  + "						pacemaker neuron terms and related content;"
  + "			</li>"
  + "					<li>"
  + "						Jo Young (Institute for Adaptive and Neural Computation, University of Edinburgh) for review of the central"
  + "						complex;"
  + "			</li>"
  + "					<li>"
  + "						Gregory Jefferis (MRC Laboratory of Molecular Biology, Cambridge) for review of the adult olfactory system."
  + "			</li>"
  + "				</ul>"
  + "				<p> Virtual Fly Brain uses open source software from a variety of sources:</p>"
  + "				<ul>"
  + "					<li> the <a href='http://owlapi.sourceforge.net/' target='_blank'>OWL-API</a> underpins handling of all ontology"
  + "				metadata and queries on VFB with help from the <a href='https://code.google.com/p/owltools/'"
  + "							target='_blank'>OWLtools</a> and <a"
  + "								href='https://github.com/loopasam/Brain/wiki' target='_blank'>brain</a> libraries;"
  + "			</li>"
  + "					<li> the super fast ontology queries that drive VFB would not be possible without the <a"
  + "						href='http://code.google.com/p/elk-reasoner/' target='_blank'>elk reasoner</a>."
  + "			</li>"
  + "				</ul>"
  + "		</p>"
  + "	"
  + "	</div >"
  + "			<div>"
  + "				<h2>Publications</h2>"
  + "				<p>"
  + "					For more information on the technology behind the VFB website:"
  + "			<br />"
  + "					<ul>"
  + "						<li>"
  + "							Milyaev, N., Osumi-Sutherland, D., Reeve, S., Burton, N., Baldock,"
  + "							R. A. and Armstrong, J. D. (2012)."
  + "				<a href='http://dx.doi.org/10.1093/bioinformatics/btr677' target='_blank'>The Virtual Fly Brain browser and"
  + "					query interface</a>. Bioinformatics 28, 411-5."
  + "			</li>"
  + "						<br />"
  + "						<li>"
  + "							Husz ZL, Burton N, Hill B, Milyaev N, Baldock RA:<a href='http://dx.doi.org/doi:10.1186/1471-2105-13-122'"
  + "								target='_blank'> Web tools for"
  + "				large-scale 3D biological images and atlases</a>. BMC Bioinformatics"
  + "							13:122, 2012."
  + "			</li>"
  + "					</ul>"
  + "				</p>"
  + "				<p> For details on the anatomy ontology:"
  + "			<br />"
  + "					<ul>"
  + "						<li>"
  + "							Osumi-Sutherland, D., Reeve, S., Mungall, C. J., Neuhaus, F.,"
  + "							Ruttenberg, A., Jefferis, G. S. and Armstrong, J. D. (2012)."
  + "				<a href='http://dx.doi.org/doi:10.1093/bioinformatics/bts113' target='_blank'> A strategy for building"
  + "					neuroanatomy ontologies</a>. Bioinformatics 28, 1262-1269."
  + "			</li>"
  + "					</ul>"
  + "				</p>"
  + "			</div>"
  + "			<div >"
  + "				<a name='citation'></a>"
  + "				<h2>How to cite us</h2>"
  + "				<p> Please use the format below:</p>"
  + "				<p>"
  + "					Milyaev, N., Osumi-Sutherland, D., Reeve, S., Burton, N., Baldock, R. A. and Armstrong, J. D. (2012). <a"
  + "						href='http://dx.doi.org/10.1093/bioinformatics/btr677' target='_blank'>The Virtual Fly Brain browser and"
  + "			query interface</a>. Bioinformatics 28, 411-5."
  + "		</p>"
  + "				<p> VFB supports the efforts of the <a href='https://scicrunch.org/resources' target='_blank'>Research Resource"
  + "			Identification Initiative</a> to enable unambiguous mentions of resources in the biomedical literature through"
  + "					the use of Research Resource Identifiers (RRIDs). To refer to VFB in your paper, please use"
  + "			<i>RRID:SCR_004229</i>, in addition to citing the paper."
  + "		</p>"
  + "			</div>"
  + "			<div >"
  + "				<h2>Contact us</h2>"
  + "			</div>"
  + "			<div class=''>"
  + "				<p>"
  + "					To report a bug on the site, use the <a href='Feedback.htm'>Report an issue</a> page. For help, comments or"
  + "					suggestions, please use"
  + "			<script>mail2('support', 'virtualflybrain', 1, '', 'this email address')</script>"
  + "					."
  + "		</p>"
  + "				<p>"
  + "					To be kept updated on new features and data sign up to our mailing list using the subscribe button on the right."
  + "		</p>"
  + "				<p>"
  + "					To tell us about new data that you generated that could be incorporated into VFB see <a href='yourPaper.htm'>here</a>."
  + "			</p>"
  + "			</div>"
  + "			<div class=''>"
  + "				<h2>Using our software or registered image data</h2>"
  + "				<p> The VFB software can be embedded in any third-party website where it can provide the same functionality as on"
  + "				the VFB website. This is because it was developed as part of an open source project and freely distributed under a"
  + "				GNU GPL2 license."
  + "		</p>"
  + "				<p>"
  + "					If you use our <a href='image_data_downloads.htm'>registered image stacks</a> in any publication, please cite"
  + "					the original authors and the VFB project."
  + "		</p>"
  + "			</div>"
  + "			<script>"
  + "				if (window.top.location.pathname != '/'){"
  + "					window.location = '/?h=about_us';"
  + "				}"
  + "	</script>"
  + "   </div>";

var contribute
  = "<div id='vfb-content-block' class='callout vfbcontent'> "
  + "<div id='vfb-content-titlebar'> "
  + "	<div id='vfb-content-title'>Contribute your data to <span style='color:white;'> Virtual Fly Brain</span></div> "
  + "</div>"
  + "<div id='vfb-content-text' class='vfbcontent'>"
  + "<h2>Submitting new data to VFB</h2>"
  + "We integrate information from published papers and image data. See below for what to "
  + "do if you have new data that could be incorporated into VFB.<br>"
  + "The provenance of information, textual or image, is always acknowledged."
  + "<h3>Tell us about your paper</h3> <p>"
  + "<b>Have you just had a paper published which describes new anatomical or expression information?</b>"
  + "<br>"
  + "The best way to make us aware of your paper, and to put it on our curation list is to act on "
  + "an email you will receive from FlyBase after your paper has been published. The link on the email "
  + "points to the <a href='http://flybase.org/submission/publication/' target='_blank'>Fast-Track Your "
  + "Paper Tool</a>. <br> Using this tool you can provide information on what types of data "
  + "your paper contains. If it has new anatomical or expression information you'll need "
  + "to fill the sections, <i>Anatomical data</i> or <i>Expression</i>, respectively, in "
  + "addition to any other suitable ones.<br>"
  + "You can also use this tool for any other, previously published paper."
  + "</p>"
  + "<h3>Do you have image data that could be incorporated into VFB?</h3>"
  + "<p>"
  + "<a href='mailto:data@virtualflybrain.org?subject=Submitting%20Image%20data'>Email us"
  + "</a>, and we will be able to give you advice on image requirements.<br>"
  + "Ideally, you should contact us when you are still in the planning stages. But if "
  + "you already generated a dataset, we'll still be able to provide advice.  "
  + "</p>"
  + "<h2>How to register your image data</h2>"
  + "<p> It is essential for successful registrations that the images are of good quality. </p>"
  + "<p> Follow <a href='http://www.dx.doi.org/10.1101/pdb.prot071720' target='_blank'>"
  + "this protocol</a> to acquire stacks that can be used for registration. </p>"
  + "<p> Once you have the images, follow <a href='http://www.dx.doi.org/10.1101/pdb.prot071738' "
  + "target='_blank'>this protocol</a> to register your images.</p>"
  + "<p> Information on publicly available template brains and bridging data is available "
  + "<a href='http://jefferislab.org/si/bridging' target='_blank'>here</a>.</p>"
  + "<script>"
  + "if (window.top.location.pathname != '/'){"
  + "window.location = '/?h=registration';"
  + "}"
  + "</script>"
  + "   </div>"
  + "   </div>";

module.exports = { about, feedback, contribute };
