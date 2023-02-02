/* eslint-disable no-undef */
import React, { Component } from 'react';
import * as FlexLayout from '@metacell/geppetto-meta-ui/flex-layout/src';
import '@metacell/geppetto-meta-ui/flex-layout/style/dark.scss'
var modelJson = require('./layoutModel').modelJson;

require('../css/base.less');
require('../css/VFBMain.less');

const styles = () => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export class TermInfo extends Component {

  constructor (props) {
    super(props);
    this.model = FlexLayout.Model.fromJson(modelJson)
  }

  shouldComponentUpdate (nextProps, nextState) {
  }
  
  componentWillReceiveProps (nextProps) {
  }

  componentDidUpdate (prevProps, prevState) {
  }

  componentWillMount () {
  }

  componentWillUnmount () {
  }

  componentDidMount () {
  }

  render () {
    return(
        <div class="flexChildContainer">
          <div id="button-bar-container-vfbterminfowidget" class="button-bar-container">
            <div id="bar-div-vfbterminfowidget" class="button-bar-div" style="width: 366px;">
              <div class="buttonBarComponentDiv">
                <span>
                  <button id="VFB_00101567_deselect_buttonBar_btn" class="btn buttonBar-button fa fa-check-circle" title="Deselect"></button>
                </span>
                <span>
                  <button id="VFB_00101567_color_buttonBar_btn" class="btn buttonBar-button fa fa-tint color-picker-button" title="Color" style="color: rgb(91, 91, 91);"></button>
                </span>
                <span>
                  <button id="VFB_00101567_zoom_buttonBar_btn" class="btn buttonBar-button fa fa-crosshairs"></button>
                </span>
                <span>
                  <button id="VFB_00101567_visibility_buttonBar_btn" class="btn buttonBar-button fa fa-eye" title="Hide"></button>
                </span>
                <span>
                  <button id="VFB_00101567_visibility_obj_buttonBar_btn" class="btn buttonBar-button fa gpt-shapeshow" title="Disable 3D Volume"></button>
                </span>
              </div>
            </div>
          </div>
          <div id="vfbterminfowidget">
            <div>
              <div class="Collapsible">
                <span id="collapsible-trigger-1675350338256" class="Collapsible__trigger is-open" aria-expanded="true" aria-disabled="false" aria-controls="collapsible-content-1675350338256" role="button">Name</span>
                <div id="collapsible-content-1675350338256" class="Collapsible__contentOuter" role="region" aria-labelledby="collapsible-trigger-1675350338256" style="height: auto; transition: none 0s ease 0s; overflow: hidden;">
                  <div class="Collapsible__contentInner">
                    <div>
                      <div tabindex="-1">
                        <div>
                          <b>JRC2018Unisex</b> [VFB_00101567] <span class="label types">
                            <span class="label label-Nervous_system">Nervous system</span>
                            <span class="label label-Adult">Adult</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div class="Collapsible">
                <span id="collapsible-trigger-1675350338257" class="Collapsible__trigger is-open" aria-expanded="true" aria-disabled="false" aria-controls="collapsible-content-1675350338257" role="button">Classification</span>
                <div id="collapsible-content-1675350338257" class="Collapsible__contentOuter" role="region" aria-labelledby="collapsible-trigger-1675350338257" style="height: auto; transition: none 0s ease 0s; overflow: hidden;">
                  <div class="Collapsible__contentInner">
                    <div>
                      <div tabindex="-1">
                        <div>
                          <ul class="terminfo-Classification">
                            <li>
                              <a href="?id=FBbt_00003624" data-instancepath="FBbt_00003624">adult brain</a>
                              <span class="label types">
                                <span class="label label-Nervous_system">Nervous system</span>
                                <span class="label label-Adult">Adult</span>
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div class="Collapsible">
                <span id="collapsible-trigger-1675350338257" class="Collapsible__trigger is-open" aria-expanded="true" aria-disabled="false" aria-controls="collapsible-content-1675350338257" role="button">Thumbnail</span>
                <div id="collapsible-content-1675350338257" class="Collapsible__contentOuter" role="region" aria-labelledby="collapsible-trigger-1675350338257" style="height: auto; transition: none 0s ease 0s; overflow: hidden;">
                  <div class="Collapsible__contentInner">
                    <div class="popup-image">
                      <a href="https://v2-dev.virtualflybrain.org/org.geppetto.frontend/geppetto/VFB_00101567">
                        <img src="https://www.virtualflybrain.org/data/VFB/i/0010/1567/VFB_00101567/thumbnailT.png">
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div class="Collapsible">
                <span id="collapsible-trigger-1675350338258" class="Collapsible__trigger is-open" aria-expanded="true" aria-disabled="false" aria-controls="collapsible-content-1675350338258" role="button">Query for</span>
                <div id="collapsible-content-1675350338258" class="Collapsible__contentOuter" role="region" aria-labelledby="collapsible-trigger-1675350338258" style="height: auto; transition: none 0s ease 0s; overflow: hidden;">
                  <div class="Collapsible__contentInner">
                    <div>
                      <div tabindex="-1">
                        <div>
                          <i class="popup-icon-link fa fa-quora"></i>
                          <a href="/org.geppetto.frontend/geppetto?q=VFB_00101567,AlignedDatasets" data-instancepath="AlignedDatasets,VFB_00101567,JRC2018Unisex">List all datasets aligned to JRC2018Unisex</a>
                          <br>
                          <i class="popup-icon-link fa fa-quora"></i>
                          <a href="/org.geppetto.frontend/geppetto?q=VFB_00101567,AllAlignedImages" data-instancepath="AllAlignedImages,VFB_00101567,JRC2018Unisex">List all images aligned to JRC2018Unisex</a>
                          <br>
                          <i class="popup-icon-link fa fa-quora"></i>
                          <a href="/org.geppetto.frontend/geppetto?q=VFB_00101567,AllDatasets" data-instancepath="AllDatasets,VFB_00101567,JRC2018Unisex">List all datasets</a>
                          <br>
                          <i class="popup-icon-link fa fa-quora"></i>
                          <a href="/org.geppetto.frontend/geppetto?q=VFB_00101567,PaintedDomains" data-instancepath="PaintedDomains,VFB_00101567,JRC2018Unisex">List all painted anatomy available for JRC2018Unisex</a>
                          <br>
                          <i class="popup-icon-link fa gpt-shapeshow"></i>
                          <a href="" title="Hide template boundary and show all painted neuroanatomy" onclick="VFB_00101567.hide();$('body').css('cursor', 'progress');window.addVfbId(JSON.parse(VFB_00101567.VFB_00101567_slices.getValue().getWrappedObj().value.data).subDomains[1].filter(function(n){ return n != null }));$('body').css('cursor', 'default');return false;">Show All Anatomy</a>
                          <br>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div class="Collapsible">
                <span id="collapsible-trigger-1675350338258" class="Collapsible__trigger is-open" aria-expanded="true" aria-disabled="false" aria-controls="collapsible-content-1675350338258" role="button">Graphs for</span>
                <div id="collapsible-content-1675350338258" class="Collapsible__contentOuter" role="region" aria-labelledby="collapsible-trigger-1675350338258" style="height: auto; transition: none 0s ease 0s; overflow: hidden;">
                  <div class="Collapsible__contentInner">
                    <div>
                      <div>
                        <i class="popup-icon-link fa fa-cogs"></i>
                        <a data-instancepath="Graph,VFB_00101567,0" style="cursor: pointer;">Show location of JRC2018Unisex</a>
                        <br>
                      </div>
                    </div>
                    <div>
                      <div>
                        <i class="popup-icon-link fa fa-cogs"></i>
                        <a data-instancepath="Graph,VFB_00101567,1" style="cursor: pointer;">Show classification of JRC2018Unisex</a>
                        <br>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div class="Collapsible">
                <span id="collapsible-trigger-1675350338259" class="Collapsible__trigger is-open" aria-expanded="true" aria-disabled="false" aria-controls="collapsible-content-1675350338259" role="button">Description</span>
                <div id="collapsible-content-1675350338259" class="Collapsible__contentOuter" role="region" aria-labelledby="collapsible-trigger-1675350338259" style="height: auto; transition: none 0s ease 0s; overflow: hidden;">
                  <div class="Collapsible__contentInner">
                    <div>
                      <div tabindex="-1">
                        <div>
                          <span class="terminfo-description">Janelia 2018 unisex, averaged adult brain template</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div class="Collapsible">
                <span id="collapsible-trigger-1675350338259" class="Collapsible__trigger is-open" aria-expanded="true" aria-disabled="false" aria-controls="collapsible-content-1675350338259" role="button">Source</span>
                <div id="collapsible-content-1675350338259" class="Collapsible__contentOuter" role="region" aria-labelledby="collapsible-trigger-1675350338259" style="height: auto; transition: none 0s ease 0s; overflow: hidden;">
                  <div class="Collapsible__contentInner">
                    <div>
                      <div tabindex="-1">
                        <div>
                          <span class="terminfo-source">
                            <a href="?id=JRC2018" data-instancepath="JRC2018">JRC 2018 templates &amp; ROIs</a>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div class="Collapsible">
                <span id="collapsible-trigger-1675350338260" class="Collapsible__trigger is-open" aria-expanded="true" aria-disabled="false" aria-controls="collapsible-content-1675350338260" role="button">License</span>
                <div id="collapsible-content-1675350338260" class="Collapsible__contentOuter" role="region" aria-labelledby="collapsible-trigger-1675350338260" style="height: auto; transition: none 0s ease 0s; overflow: hidden;">
                  <div class="Collapsible__contentInner">
                    <div>
                      <div tabindex="-1">
                        <div>
                          <span class="terminfo-license">
                            <a href="?id=VFBlicense_CC_BY_NC_SA_4_0" data-instancepath="VFBlicense_CC_BY_NC_SA_4_0">CC-BY-NC-SA_4.0 <img class="terminfo-licenseicon" src="http://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-nc-sa.png" title="CC-BY-NC-SA_4.0">
                            </a>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div class="Collapsible">
                <span id="collapsible-trigger-1675350338260" class="Collapsible__trigger is-open" aria-expanded="true" aria-disabled="false" aria-controls="collapsible-content-1675350338260" role="button">Aligned to</span>
                <div id="collapsible-content-1675350338260" class="Collapsible__contentOuter" role="region" aria-labelledby="collapsible-trigger-1675350338260" style="height: auto; transition: none 0s ease 0s; overflow: hidden;">
                  <div class="Collapsible__contentInner">
                    <div>
                      <div tabindex="-1">
                        <div>
                          <a href="?id=VFB_00101567" data-instancepath="VFB_00101567">JRC2018Unisex</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div class="Collapsible">
                <span id="collapsible-trigger-1675350338260" class="Collapsible__trigger is-open" aria-expanded="true" aria-disabled="false" aria-controls="collapsible-content-1675350338260" role="button">Downloads</span>
                <div id="collapsible-content-1675350338260" class="Collapsible__contentOuter" role="region" aria-labelledby="collapsible-trigger-1675350338260" style="height: auto; transition: none 0s ease 0s; overflow: hidden;">
                  <div class="Collapsible__contentInner">
                    <div>
                      <div tabindex="-1">
                        <div>
                          <br>Mesh/Pointcloud (OBJ): <a download="VFB_00101567_mesh.obj" href="/data/VFB/i/0010/1567/VFB_00101567/volume_man.obj">VFB_00101567_mesh.obj</a>
                          <br>Slices (Woolz): <a download="VFB_00101567.wlz" href="/data/VFB/i/0010/1567/VFB_00101567/volume.wlz">VFB_00101567.wlz</a>
                          <br>Aligned Image: <a download="VFB_00101567.nrrd" href="/data/VFB/i/0010/1567/VFB_00101567/volume.nrrd">VFB_00101567.nrrd</a>
                          <br>Note: see source &amp; license above for terms of reuse and correct attribution.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}