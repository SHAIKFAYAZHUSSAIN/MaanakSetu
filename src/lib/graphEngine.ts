import { IndianStandard, StandardRelationship } from '../types/standards';

export interface GraphNode {
  id: string;
  label: string;
  title: string;
  group: 'primary' | 'safety' | 'testing' | 'allied' | 'amendment' | 'certification';
  status: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  label: string;
  type: string;
}

export interface StandardsGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function buildStandardsKnowledgeGraph(
  primaryStandard: IndianStandard,
  relatedStandards: { standard: IndianStandard; normativeRelations: StandardRelationship[] }[]
): StandardsGraphData {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const visitedNodeIds = new Set<string>();

  // 1. Primary Standard Node
  nodes.push({
    id: primaryStandard.isNumber,
    label: primaryStandard.isNumber,
    title: primaryStandard.title,
    group: 'primary',
    status: primaryStandard.status,
  });
  visitedNodeIds.add(primaryStandard.isNumber);

  // 2. QCO Certification Node
  const certNodeId = `CERT-${primaryStandard.qco.scheme.split(' ')[0]}`;
  nodes.push({
    id: certNodeId,
    label: primaryStandard.qco.scheme,
    title: primaryStandard.qco.orderName || 'BIS Certification',
    group: 'certification',
    status: primaryStandard.qco.isCompulsory ? 'Compulsory QCO' : 'Voluntary Scheme',
  });
  visitedNodeIds.add(certNodeId);

  edges.push({
    from: primaryStandard.isNumber,
    to: certNodeId,
    label: primaryStandard.qco.isCompulsory ? 'COMPULSORY_QCO' : 'VOLUNTARY_SCHEME',
    type: 'CERTIFICATION',
  });

  // 3. Amendments Nodes
  if (primaryStandard.versionChain.amendments.length > 0) {
    primaryStandard.versionChain.amendments.forEach((amd) => {
      const amdId = `${primaryStandard.isNumber}-AMD-${amd.number}`;
      if (!visitedNodeIds.has(amdId)) {
        visitedNodeIds.add(amdId);
        nodes.push({
          id: amdId,
          label: `Amd ${amd.number}:${amd.year}`,
          title: amd.summary,
          group: 'amendment',
          status: 'Active Amendment',
        });

        edges.push({
          from: primaryStandard.isNumber,
          to: amdId,
          label: 'AMENDED_BY',
          type: 'AMENDED_BY',
        });
      }
    });
  }

  // 4. Relationships from Primary Standard
  primaryStandard.relationships.forEach((rel) => {
    let group: 'safety' | 'testing' | 'allied' = 'allied';
    if (rel.relationshipType === 'SAFETY_REQUIREMENT' || rel.relationshipType === 'REQUIRES') {
      group = 'safety';
    } else if (rel.relationshipType === 'TESTED_BY') {
      group = 'testing';
    }

    if (!visitedNodeIds.has(rel.targetStandardNumber)) {
      visitedNodeIds.add(rel.targetStandardNumber);
      nodes.push({
        id: rel.targetStandardNumber,
        label: rel.targetStandardNumber,
        title: rel.targetTitle,
        group,
        status: 'Normative Reference',
      });
    }

    edges.push({
      from: primaryStandard.isNumber,
      to: rel.targetStandardNumber,
      label: rel.relationshipType,
      type: rel.relationshipType,
    });
  });

  // 5. Expand 2nd-hop relationships for richer graph
  relatedStandards.slice(0, 3).forEach((item) => {
    item.standard.relationships.forEach((subRel) => {
      if (!visitedNodeIds.has(subRel.targetStandardNumber) && nodes.length < 16) {
        visitedNodeIds.add(subRel.targetStandardNumber);
        nodes.push({
          id: subRel.targetStandardNumber,
          label: subRel.targetStandardNumber,
          title: subRel.targetTitle,
          group: 'allied',
          status: 'Second-Hop Standard',
        });

        edges.push({
          from: item.standard.isNumber,
          to: subRel.targetStandardNumber,
          label: subRel.relationshipType,
          type: subRel.relationshipType,
        });
      }
    });
  });

  return { nodes, edges };
}
