

/*import { BinaryHeap } from 'heaps.js';*/


onload = function ()
{
				
			class BinaryHeap 
			{

					constructor()
					{
							this.arr = [];
					}

					empty()
					{
							return (this.arr.length == 0);
					}

					size()
					{
						return this.arr.length;
					}

					heapify(index)
					{
							let idx = index,L_idx = -1,R_idx = -1;

							if(2 * idx + 1 < this.arr.length && this.arr[2 * idx + 1][0] < this.arr[idx][0])
								L_idx = 2 * idx + 1;

							if(2 * idx + 2  < this.arr.length && this.arr[2 * idx + 2][0] < this.arr[idx][0])
								R_idx = 2 * idx + 2;

							let swap_idx = -1,swap_val = -1;

							if(L_idx != -1)
							{
									swap_val = this.arr[L_idx][0];
									swap_idx = L_idx;
							}

							if(R_idx != -1)
							{
									if(swap_val > this.arr[R_idx][0])
									{
											swap_val = this.arr[R_idx][0];
											swap_idx = R_idx;
									}
							}

							if(swap_idx != -1)
							{
									let temp = this.arr[idx];
									this.arr[idx] = this.arr[swap_idx];
									this.arr[swap_idx] = temp;

									this.heapify(swap_idx);
							}

					}

					pop()
					{
							if(this.arr.length == 0)
							{
									console.log("Heap is empty. Cannot perform pop operation");
									return;
							}

							let idx = this.arr.length-1;

							let ans = this.arr[0];

							let temp = this.arr[0];
							this.arr[0] = this.arr[idx];
							this.arr[idx] = temp;

							this.arr.pop();

							if(this.arr.length)
								this.heapify(0);

							return ans;

					}

					push(val)
					{
							this.arr.push(val);
							let idx = this.arr.length-1;
							let par = Math.floor((idx-1)/2);

							while(idx > 0)
							{
									if(this.arr[idx][0] > this.arr[par][0])
									 break;

									let temp = this.arr[idx];
									this.arr[idx] = this.arr[par];
									this.arr[par] = temp;

									idx = par;
									par = Math.floor((par-1)/2);
							}
					}




			}

			arr = new BinaryHeap();


			const container1 = document.getElementById('mynetwork');
			const container2 = document.getElementById('mynetwork2');
			const generate = document.getElementById('generate-graph');
			const ans = document.getElementById('solve');
			const temptext  = document.getElementById('temptext');
			var final_data;


			 const options = {
			        edges: {
			            arrows: {
			                to: true
			            },
			            labelHighlightBold: true,
			            font: {
			                size: 20
			            }
			        },
			        nodes: {
			            font: '12px arial red',
			            scaling: {
			                label: true
			            },
			            shape: 'icon',
			            icon: {
			                face: 'FontAwesome',
			                code: '\uf183',
			                size: 50,
			                color: '#991133',
			            }
			        }
			    };


			ques_network = new vis.Network(container1);
			ques_network.setOptions(options);
			ans_newtwork = new vis.Network(container2);
			ans_newtwork.setOptions(options);

			// creating graph of data

			function createGraph()
			{
					let edges = [];
					let nodes = [];

					let V = Math.floor(Math.random()*10);

					for(let i = 1; i <= V ; i++)
					{
							nodes.push({id : i,label : "person"+i});
					}

					for(let i = 1; i <= V ; i++)
					{
							for(let j = i + 1; j <= V ; j++)
							{
									let isEdge = Math.random();

									if(isEdge > 0.5)
									{
											let Dir = Math.random();

											if(Dir > 0.5)
											{
													edges.push({from : i , to : j , label : String(Math.floor(Math.random()*100))});
											}
											else
											{
													edges.push({from : j , to : i , label : String(Math.floor(Math.random()*100))});		
											}
									}
							}
					}


					data = {

						nodes : nodes,
						edges : edges,
					};


					return data;
			}

			// solving dynamically generated data


			function solution()
			{
					let V = final_data.nodes.length;

					let vals = [];

					console.log(V,final_data.edges);



					for(let i = 0;i <= V; i++)
						vals.push(0);

					for(let i = 0;i < final_data.edges.length; i++)
					{
						 let edge = final_data.edges[i];

						 console.log(edge,edge.from,edge.to);

						 let give = parseInt(edge.label),node1 = edge.from,node2 = edge.to;

						  vals[node1]-=give;
						  vals[node2]+=give;
					}

					giver = new BinaryHeap();
					taker = new BinaryHeap();

					console.log(vals);

					for(let i = 1 ; i <= V; i++)
					{
							if(vals[i] > 0 )
								taker.push([-vals[i],i]);
							else if(vals[i] < 0)
								giver.push([vals[i],i]);
					}

					let newedges = [];

					console.log(giver.arr[0],taker.arr[0],giver.size(),taker.size());

					while(!giver.empty() && !taker.empty())
					{
							let need = giver.pop();
							let give = taker.pop();

							let newneed = -need[0];
							let newgive = -give[0];

						//	console.log(newneed,newgive,need[1],give[1]);

							if(newneed >= newgive)
							{
									newneed-=newgive;

									newedges.push({from : give[1],to : need[1] , label : String(newgive)});

									if(newneed > 0)
										giver.push([-newneed,need[1]]);
							}
							else
							{
									newgive-=newneed;

									newedges.push({from : give[1],to : need[1] , label : String(newneed)});

									if(newgive)
										taker.push([-newgive,give[1]]);

							}
					}

					ans_data = {

						nodes : final_data.nodes,
						edges : newedges,
					};

					return ans_data;

					 
			}
		

			generate.onclick = function ()
			{
					let get_data = createGraph();
					final_data = get_data;
					ques_network.setData(get_data);
					temptext.style.display = "inline";
					container2.style.display = "none";
			}

			ans.onclick = function()
			{		
					temptext.style.display = "none";
					container2.style.display = "inline";
					ans_data = solution();
					ans_newtwork.setData(ans_data);
			}
					

};


